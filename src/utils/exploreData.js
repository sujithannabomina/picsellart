// src/utils/exploreData.js

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import {
  getDownloadURL,
  list,
  ref as storageRef,
} from "firebase/storage";

import { db, storage } from "./firebase";

// --- Tunables ---
const PAGE_SIZE = 18; // grid size per page
const PUBLIC_PREFIX = "public"; // gs://<bucket>/public/<uid>/...

/**
 * Load one Explore "page".
 * Strategy:
 *  1) Try Firestore collection `publicImages` (ordered by createdAt desc)
 *  2) If nothing comes back and we have no cursor yet, fallback to listing Storage.
 *
 * @param {Object} opts
 *  - cursor: Firestore DocumentSnapshot to start after (optional)
 *  - search:  string for client-side filtering (optional)
 *  - storageCursor: {prefix, pageToken} internal cursor for Storage paging (optional)
 */
export async function loadExplorePage(opts = {}) {
  const { cursor = null, search = "", storageCursor = null } = opts;

  // --------- 1) Firestore page ----------
  try {
    const coll = collection(db, "publicImages");
    const baseQ = cursor
      ? query(coll, orderBy("createdAt", "desc"), startAfter(cursor), limit(PAGE_SIZE))
      : query(coll, orderBy("createdAt", "desc"), limit(PAGE_SIZE));

    const snap = await getDocs(baseQ);

    // Map to uniform items
    let items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || d.id,
        tags: data.tags || [],
        // publicPath always points to the watermarked copy
        publicPath: data.publicPath,
        createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        uid: data.uid || "",
      };
    });

    // Client-side filter (simple & robust)
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (it) =>
          it.title?.toLowerCase().includes(q) ||
          (Array.isArray(it.tags) && it.tags.join(" ").toLowerCase().includes(q))
      );
    }

    // Get signed URLs in parallel
    const resolved = await Promise.all(
      items.map(async (it) => {
        try {
          const url = await getDownloadURL(storageRef(storage, it.publicPath));
          return { ...it, url };
        } catch {
          return { ...it, url: null };
        }
      })
    );

    // If FS returns something usable, use it
    if (resolved.some((x) => !!x.url)) {
      const lastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
      return {
        source: "firestore",
        items: resolved.filter((x) => x.url),
        next: lastDoc || null,
        storageNext: storageCursor || null,
      };
    }

    // Else fall through to Storage.
  } catch (e) {
    // Firestore might be empty for some accounts; we fallback silently.
    // console.warn("Firestore explore fallback:", e);
  }

  // --------- 2) Storage fallback (prefix = /public/) ----------
  const prefix = storageCursor?.prefix || PUBLIC_PREFIX;
  const pageToken = storageCursor?.pageToken || undefined;

  // We list at /public level; this can be many items, so we page using list() with maxResults.
  const listRef = storageRef(storage, prefix);
  const listed = await list(listRef, { maxResults: PAGE_SIZE, pageToken });

  // Turn storage items into cards. We keep a lightweight title from filename.
  const items = await Promise.all(
    listed.items.map(async (obj) => {
      try {
        const url = await getDownloadURL(obj);
        const name = obj.name || "";
        const title = (name.replace(/_wm\.jpg$/i, "") || "Photo").slice(0, 40);
        return {
          id: obj.fullPath,
          title,
          tags: [],
          publicPath: obj.fullPath,
          createdAt: Date.now(),
          uid: "", // unknown from storage only
          url,
        };
      } catch {
        return null;
      }
    })
  );

  const cleanItems = items.filter(Boolean);

  // Client-side filter on the fallback too
  const q = search.trim().toLowerCase();
  const filtered = q
    ? cleanItems.filter((it) => it.title.toLowerCase().includes(q))
    : cleanItems;

  const storageNext =
    listed.nextPageToken ? { prefix, pageToken: listed.nextPageToken } : null;

  return {
    source: "storage",
    items: filtered,
    next: null, // Firestore cursor only
    storageNext,
  };
}

export const EXPLORE_PAGE_SIZE = PAGE_SIZE;
