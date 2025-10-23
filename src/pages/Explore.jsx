// src/pages/Explore.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  listAll,
  ref as storageRef,
} from "firebase/storage";
import { db, storage } from "../utils/firebase";

/** ---------- Types & helpers ---------- */

/**
 * A "Photo" item normalized from either Firestore or Storage.
 * id, url, thumbUrl?, title?, price?, tags?, sellerId?, source, createdAt?
 */
function normalizeFromDoc(doc) {
  const d = doc.data ? doc.data() : {};
  return {
    id: doc.id,
    url: d.url || d.watermarkUrl || d.thumbUrl || "",
    originalUrl: d.url || "",
    thumbUrl: d.thumbUrl || d.watermarkUrl || d.url || "",
    title: d.title || "Untitled",
    price: typeof d.price === "number" ? d.price : null,
    tags: Array.isArray(d.tags) ? d.tags : [],
    sellerId: d.sellerId || null,
    source: "firestore",
    createdAt: d.createdAt?.toMillis?.() ?? 0,
    // keep any other fields you might pass to details
    meta: d,
  };
}

function normalizeFromStorage(path, url) {
  const file = path.split("/").pop() || "photo";
  return {
    id: `storage:${path}`,
    url, // we treat public/ as public; this is OK for previews
    originalUrl: url,
    thumbUrl: url,
    title: file.replace(/\.[a-z0-9]+$/i, ""),
    price: null,
    tags: [],
    sellerId: null,
    source: "storage",
    createdAt: 0,
    meta: {},
  };
}

function dedupeByUrl(items) {
  const seen = new Set();
  return items.filter((it) => {
    const key = it.url;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** ---------- Data loaders ---------- */

async function loadFirestorePublic(max = 500) {
  const col = collection(db, "photos");
  try {
    // Preferred: indexed query
    const q = query(
      col,
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeFromDoc(d));
  } catch (e) {
    // Fallback if index/orderBy not available
    const snap = await getDocs(col);
    return snap.docs
      .map((d) => normalizeFromDoc(d))
      .filter((x) => x.meta?.isPublic === true);
  }
}

async function loadStoragePublicFolder(folder = "public") {
  try {
    const root = storageRef(storage, folder);
    const res = await listAll(root);
    const urls = await Promise.all(
      res.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return normalizeFromStorage(item.fullPath, url);
      })
    );
    return urls;
  } catch {
    return [];
  }
}

/** ---------- UI components ---------- */

function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search title or tags…"
      className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
      aria-label="Search photos"
    />
  );
}

function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl border border-neutral-200 bg-white"
      aria-label="Sort"
    >
      <option value="new">Newest</option>
      <option value="old">Oldest</option>
      <option value="title">Title A–Z</option>
      <option value="price">Price Low → High</option>
    </select>
  );
}

function PhotoCard({ photo, onOpen }) {
  return (
    <button
      onClick={() => onOpen(photo)}
      className="group text-left rounded-2xl overflow-hidden bg-white border border-neutral-100 hover:border-neutral-200 shadow-soft hover:shadow transition focus:outline-none focus:ring-2 focus:ring-brand-500"
      title={photo.title}
    >
      <div className="aspect-[4/5] w-full bg-neutral-100">
        <img
          src={photo.thumbUrl || photo.url}
          alt={photo.title}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium line-clamp-1">{photo.title}</h3>
          <span className="text-sm text-neutral-500">
            {typeof photo.price === "number" ? `₹${photo.price}` : "—"}
          </span>
        </div>
        {photo.tags?.length ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {photo.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}

/** ---------- Page ---------- */

export default function Explore() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState([]); // full dataset (FS + Storage)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("new");

  // Paging
  const PAGE_SIZE = 24;
  const [page, setPage] = useState(1);
  const listRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function loadAll() {
      setLoading(true);
      setError("");
      try {
        const [fromFS, fromStorage] = await Promise.all([
          loadFirestorePublic(500),
          loadStoragePublicFolder("public"),
        ]);
        const merged = dedupeByUrl([...fromFS, ...fromStorage]);
        if (active) setRaw(merged);
      } catch (e) {
        if (active) setError("Failed to load photos. Please try again.");
        // still render whatever we have
      } finally {
        if (active) setLoading(false);
      }
    }
    loadAll();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = raw;

    if (q) {
      arr = arr.filter((p) => {
        const t = (p.title || "").toLowerCase();
        const tags = (p.tags || []).join(" ").toLowerCase();
        return t.includes(q) || tags.includes(q);
      });
    }

    switch (sortBy) {
      case "old":
        arr = [...arr].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        break;
      case "title":
        arr = [...arr].sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
        break;
      case "price":
        arr = [...arr].sort(
          (a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER)
        );
        break;
      case "new":
      default:
        arr = [...arr].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    return arr;
  }, [raw, search, sortBy]);

  const paged = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const canLoadMore = paged.length < filtered.length;

  function openDetails(photo) {
    // Keep the existing navigation pattern (PhotoDetails reads from state)
    navigate("/photo", { state: { photo } });
  }

  function loadMore() {
    setPage((p) => p + 1);
    // small UX scroll nudge
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Explore</h1>
          <div className="flex flex-wrap items-center gap-3">
            <SearchBar value={search} onChange={setSearch} />
            <SortSelect value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Status */}
        {loading && (
          <p className="mt-6 text-neutral-500">Loading photos…</p>
        )}
        {!loading && error && (
          <p className="mt-6 text-red-600">{error}</p>
        )}
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-12" ref={listRef}>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paged.map((p) => (
            <PhotoCard key={p.id} photo={p} onOpen={openDetails} />
          ))}
        </div>

        {/* Empty state */}
        {!loading && paged.length === 0 && (
          <div className="mt-12 text-center text-neutral-500">
            No photos found. Try clearing filters.
          </div>
        )}

        {/* Load more */}
        {canLoadMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition"
            >
              Load more
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
