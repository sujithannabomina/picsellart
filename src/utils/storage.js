// src/utils/storage.js
// Single source of truth for Storage operations used by Explore and Photo Details.

import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../firebase";

// ---------- CONFIG ----------
/**
 * Explore must aggregate from Firebase Storage only.
 * These are the root prefixes (folders) you showed in your screenshot.
 * We search inside each of these for images.
 */
const EXPLORE_PREFIXES = ["Buyer", "public"];

/**
 * File extensions we consider as images for the Explore page.
 */
const ALLOWED_IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Utility: quick check for image extension.
 */
function isImageFile(name = "") {
  const lower = String(name).toLowerCase();
  return ALLOWED_IMAGE_EXT.some((ext) => lower.endsWith(ext));
}

/**
 * Utility: builds a minimal item shape for the UI from a Storage reference
 */
async function toImageItem(fileRef, defaultTitle = "streetphotography") {
  const [url, meta] = await Promise.all([
    getDownloadURL(fileRef),
    // metadata is useful for size/type; failures shouldn’t block rendering
    getMetadata(fileRef).catch(() => null),
  ]);

  // Random demo price for now (replace with Firestore price if/when you add it)
  const randomPrice = 99 + Math.floor(Math.random() * 151); // 99–249

  return {
    id: fileRef.fullPath,            // e.g., "Buyer/abc.jpg"
    name: fileRef.name,              // e.g., "abc.jpg"
    path: fileRef.fullPath,
    url,                             // raw download URL (viewer/watermark will wrap)
    title: defaultTitle,
    price: randomPrice,
    contentType: meta?.contentType || "image/jpeg",
    bytes: meta?.size ?? undefined,
    updated: meta?.updated ?? undefined,
    // useful flags for filtering/sorting later
    source: fileRef.fullPath.split("/")[0] || "public",
  };
}

/**
 * Lists all images inside a given prefix (e.g., "Buyer" or "public").
 * This assumes your images are stored directly under the prefix or in nested folders.
 */
async function listAllFromPrefix(prefix) {
  const rootRef = ref(storage, prefix);
  const { items = [], prefixes = [] } = await listAll(rootRef);

  // Gather items in this folder
  const here = items.filter((i) => isImageFile(i.name));

  // Recurse into subfolders (if any)
  const nestedPromises = prefixes.map(async (p) => {
    const nested = await listAll(p);
    const nestedItems = nested.items.filter((i) => isImageFile(i.name));
    // Note: only one level deep is usually enough; expand to full recursion if you need
    return nestedItems;
  });

  const nestedArrays = await Promise.all(nestedPromises);
  const allItemRefs = [...here, ...nestedArrays.flat()];

  // Convert to UI items
  const results = await Promise.all(allItemRefs.map((f) => toImageItem(f)));
  return results;
}

// ---------- PUBLIC EXPORTS ----------

/**
 * Fetch all explore images (from Firebase Storage only).
 * Merges both "Buyer" and "public" roots.
 */
export async function fetchAllExploreImages() {
  const lists = await Promise.all(EXPLORE_PREFIXES.map((p) => listAllFromPrefix(p)));
  // Merge and sort by name ascending (adjust to any strategy you prefer)
  return lists.flat().sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Paginate and (optionally) filter already-fetched items in-memory.
 * - items: array from fetchAllExploreImages()
 * - page: 1-based page index
 * - pageSize: number per page
 * - q: optional text to filter by name/title
 * - priceMin/priceMax: optional inclusive price bounds
 */
export function filterAndPaginate({
  items,
  page = 1,
  pageSize = 24,
  q = "",
  priceMin,
  priceMax,
}) {
  let data = Array.isArray(items) ? items : [];

  // basic text filter
  if (q) {
    const needle = q.toLowerCase();
    data = data.filter(
      (it) =>
        it.name.toLowerCase().includes(needle) ||
        (it.title || "").toLowerCase().includes(needle)
    );
  }

  // price filters
  if (typeof priceMin === "number") {
    data = data.filter((it) => Number(it.price) >= priceMin);
  }
  if (typeof priceMax === "number") {
    data = data.filter((it) => Number(it.price) <= priceMax);
  }

  const total = data.length;
  const maxPage = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const current = Math.min(Math.max(1, page), maxPage);
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = data.slice(start, end);

  return { items: pageItems, total, page: current, maxPage };
}

/**
 * Landing page hero carousel/list:
 * Returns the 6 local images from /public/images (Vite serves them at /images/*)
 * This intentionally does NOT hit Firebase—per your rule, landing images are local.
 */
export function fetchLandingImages() {
  // If filenames may change later, keep this in a small config file instead.
  const names = ["sample1.jpg", "sample2.jpg", "sample3.jpg", "sample4.jpg", "sample5.jpg", "sample6.jpg"];
  return names.map((n) => ({
    id: `local:${n}`,
    name: n,
    path: `/images/${n}`,
    url: `/images/${n}`, // used directly in <img>
    title: "Picsellart",
  }));
}

/**
 * For the Photo Details page:
 * Find a single image by file name across "Buyer" and "public" roots,
 * and return one normalized item with url + metadata.
 * Route example: /photo/:name where :name matches the file name (e.g., "abc.jpg").
 */
export async function getPublicImageByName(fileName) {
  if (!fileName) return null;

  // Search each prefix until found
  for (const prefix of EXPLORE_PREFIXES) {
    const r = ref(storage, `${prefix}/${fileName}`);
    try {
      // If this exact path exists, return it
      const [url, meta] = await Promise.all([
        getDownloadURL(r),
        getMetadata(r).catch(() => null),
      ]);

      return {
        id: r.fullPath,
        name: fileName,
        path: r.fullPath,
        url,
        title: "streetphotography",
        price: 199, // replace with real price when you wire Firestore pricing
        contentType: meta?.contentType || "image/jpeg",
        bytes: meta?.size ?? undefined,
        updated: meta?.updated ?? undefined,
        source: prefix,
      };
    } catch {
      // Not found at this exact path—fall back to scanning the folder for a case-insensitive match
      const list = await listAll(ref(storage, prefix));
      const match = list.items.find((i) => i.name.toLowerCase() === String(fileName).toLowerCase());
      if (match) {
        const [url, meta] = await Promise.all([
          getDownloadURL(match),
          getMetadata(match).catch(() => null),
        ]);
        return {
          id: match.fullPath,
          name: match.name,
          path: match.fullPath,
          url,
          title: "streetphotography",
          price: 199,
          contentType: meta?.contentType || "image/jpeg",
          bytes: meta?.size ?? undefined,
          updated: meta?.updated ?? undefined,
          source: prefix,
        };
      }
      // else continue to next prefix
    }
  }

  // Not found anywhere
  return null;
}
