// src/pages/ExplorePage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit as fbLimit,
  startAfter,
  endBefore,
  limitToLast,
  onSnapshot,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase"; // if your export lives in src/firebase.js then use: "../firebase"

const PAGE_SIZE = 25;

export default function ExplorePage() {
  const [items, setItems] = useState([]);          // documents for current page
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1); // 1-based page index
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");

  // We keep a stack of cursors to navigate pages (startAfter docs)
  const cursorsRef = useRef([]); // cursorsRef.current[i] holds the last doc for page i+1

  // Build the base Firestore query (title/category filters are applied server-side when possible)
  const qryBase = useMemo(() => {
    try {
      const col = collection(db, "photos");
      const constraints = [];

      // Basic filters:
      // titlePrefix: we do a client-side filter for flexible contains, BUT when search is non-empty,
      // we also try a simple startsWith behavior using >= and < bounds. If you prefer exact contains,
      // leave it client-side (current hybrid approach keeps things snappy).
      if (search.trim()) {
        // For server-side title prefix search, you’d need an extra field with lowercasedTitle.
        // Here we’ll just do client-side filtering after fetching the page.
      }

      if (category !== "all") {
        constraints.push(where("category", "==", category));
      }

      // Default sort newest first
      constraints.push(orderBy("createdAt", "desc"));

      return query(col, ...constraints);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [db, search, category]);

  // Helper to load a page by “direction”
  const fetchPage = async (direction) => {
    if (!qryBase) return;

    setLoading(true);
    setError("");

    try {
      let q;

      if (direction === "init") {
        // first page
        q = query(qryBase, fbLimit(PAGE_SIZE));
      } else if (direction === "next") {
        const lastCursor = cursorsRef.current[cursorsRef.current.length - 1];
        if (!lastCursor) return;
        q = query(qryBase, startAfter(lastCursor), fbLimit(PAGE_SIZE));
      } else if (direction === "prev") {
        const prevCursor = cursorsRef.current[cursorsRef.current.length - 2];
        // To go backwards we need endBefore + limitToLast
        if (!prevCursor && pageNumber > 1) {
          // reload first page if something odd
          q = query(qryBase, fbLimit(PAGE_SIZE));
        } else {
          q = query(qryBase, endBefore(prevCursor), limitToLast(PAGE_SIZE));
        }
      }

      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data(), _snap: d }));

      // Client-side search “contains” (case-insensitive) on title if user typed anything
      const filtered =
        search.trim()
          ? docs.filter((d) =>
              String(d.title || "")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
            )
          : docs;

      setItems(filtered);

      // Manage cursors and page flags
      if (direction === "init") {
        cursorsRef.current = [];
        if (snap.docs.length > 0) {
          cursorsRef.current.push(snap.docs[snap.docs.length - 1]);
        }
        setPageNumber(1);
      } else if (direction === "next") {
        if (snap.docs.length > 0) {
          cursorsRef.current.push(snap.docs[snap.docs.length - 1]);
          setPageNumber((p) => p + 1);
        }
      } else if (direction === "prev") {
        // When going prev, drop the last cursor (we moved one page back)
        if (cursorsRef.current.length > 1) {
          cursorsRef.current.pop();
        }
        setPageNumber((p) => Math.max(1, p - 1));
      }

      // Determine hasNext by peeking one more doc after this page’s last cursor
      if (snap.docs.length === PAGE_SIZE) {
        const last = snap.docs[snap.docs.length - 1];
        const probe = await getDocs(query(qryBase, startAfter(last), fbLimit(1)));
        setHasNext(!probe.empty);
      } else {
        setHasNext(false);
      }

      setHasPrev(pageNumber > 1 || direction === "next"); // if we’ve ever gone next, prev exists
    } catch (e) {
      console.error(e);
      setError("Could not load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load + whenever filters change → reset to first page
  useEffect(() => {
    fetchPage("init");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qryBase]); // rebuilding the query means new first page

  // Live updates for the **current page**:
  // Rebuilds a listener scoped to the current page window. For simplicity we re-fetch
  // the current page whenever there is any change (minimal extra reads, maximum correctness).
  useEffect(() => {
    if (!qryBase || items.length === 0) return;

    // Find the window for the current page: from first doc’s createdAt to last doc’s createdAt
    const first = items[0]?.createdAt;
    const last = items[items.length - 1]?.createdAt;
    if (!first || !last) return;

    // Listen to any changes within or after the first bound to keep things “live enough”
    const qLive = query(qryBase, where("createdAt", "<=", first));

    const unsub = onSnapshot(
      qLive,
      () => {
        // Any change → refresh current page window
        fetchPage("init"); // simplest: re-run first page with current filters
      },
      (err) => {
        console.error(err);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qryBase, pageNumber, items.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
          <h1 className="text-2xl font-semibold">Explore Photos</h1>

          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title"
              className="h-10 w-56 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              <option value="all">All Categories</option>
              <option value="StreetPhotography">StreetPhotography</option>
              <option value="Nature">Nature</option>
              <option value="Portrait">Portrait</option>
              <option value="City">City</option>
              <option value="Abstract">Abstract</option>
            </select>

            <button
              onClick={() => fetchPage("init")}
              className="h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800"
              title="Refresh"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="grid place-items-center py-24 text-gray-500">
            Loading photos…
          </div>
        ) : items.length === 0 ? (
          <div className="grid place-items-center py-24 text-gray-500">
            No photos found.
          </div>
        ) : (
          <>
            {/* Masonry-ish responsive grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <PhotoCard key={p.id} photo={p} />
              ))}
            </div>

            {/* Pager */}
            <div className="mt-8 flex items-center justify-between">
              <button
                disabled={!hasPrev || pageNumber === 1}
                onClick={() => fetchPage("prev")}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  !hasPrev || pageNumber === 1
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                ← Prev
              </button>

              <span className="text-sm text-gray-600">
                Page <strong>{pageNumber}</strong>
              </span>

              <button
                disabled={!hasNext}
                onClick={() => fetchPage("next")}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  !hasNext
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PhotoCard({ photo }) {
  const {
    url,             // public download URL (string)
    title = "Untitled",
    price = 0,
    category = "StreetPhotography",
    width,
    height,
  } = photo;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        <img
          src={url}
          alt={`${title} image`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/images/sample1.jpg"; // soft fallback
          }}
        />
        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
          {category}
        </span>
      </div>

      <div className="flex items-center justify-between px-3 py-3">
        <div>
          <div className="line-clamp-1 text-sm font-medium text-gray-900">
            {title}
          </div>
          <div className="text-xs text-gray-500">
            {width && height ? `${width}×${height}px` : "High-res JPEG"}
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-900">₹{price}</div>
      </div>
    </div>
  );
}
