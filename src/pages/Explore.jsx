// src/pages/Explore.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ImageCard from "../components/ImageCard";
import { EXPLORE_PAGE_SIZE, loadExplorePage } from "../utils/exploreData";

export default function Explore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("firestore"); // or "storage"
  const [error, setError] = useState("");

  // Cursor stacks to support Prev
  const fsCursors = useRef([]);         // stack of Firestore cursors (DocumentSnapshot)
  const stCursors = useRef([]);         // stack of Storage cursors ({prefix, pageToken})

  // Current cursors
  const [cursor, setCursor] = useState(null);           // Firestore cursor
  const [storageCursor, setStorageCursor] = useState(null); // Storage cursor

  const pageTitle = useMemo(() => {
    if (!search) return "Explore Pictures";
    return `Explore: “${search}”`;
  }, [search]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const { items, next, storageNext, source } = await loadExplorePage({
          cursor,
          search,
          storageCursor,
        });

        if (!alive) return;

        setItems(items);
        setSource(source || "firestore");

        // Update the next pointers for the "Next" button
        setCursor(next || null);
        setStorageCursor(storageNext || null);
      } catch (e) {
        if (!alive) return;
        setError("Could not load images. Please try again.");
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [search]); // initial load only uses search; next/prev handlers mutate cursors manually

  // Handlers for pagination
  const goNext = async () => {
    setLoading(true);
    setError("");

    try {
      // Push current cursor to stacks for "Prev" to work
      if (source === "firestore") {
        fsCursors.current.push(cursor);
      } else {
        stCursors.current.push(storageCursor);
      }

      const { items, next, storageNext, source: src } = await loadExplorePage({
        cursor,
        search,
        storageCursor,
      });

      setItems(items);
      setSource(src || "firestore");
      setCursor(next || null);
      setStorageCursor(storageNext || null);
    } catch {
      setError("Could not load next page.");
    } finally {
      setLoading(false);
    }
  };

  const goPrev = async () => {
    if (source === "firestore") {
      const prev = fsCursors.current.pop() || null;
      // When going back on Firestore, we need to rebuild the page correctly:
      // Reload from the beginning and walk the stack except the last.
      await reloadFromStart(search, fsCursors.current, null);
      setCursor(prev);
    } else {
      const prev = stCursors.current.pop() || null;
      await reloadFromStart(search, null, stCursors.current);
      setStorageCursor(prev);
    }
  };

  // Replay from page 1 until the last saved cursor in the stack.
  const reloadFromStart = async (q, fsStack, stStack) => {
    setLoading(true);
    setError("");

    try {
      let tmpCursor = null;
      let tmpStorage = null;
      let lastPage = [];

      // Number of forward steps to reproduce
      const steps =
        (fsStack ? fsStack.length : 0) || (stStack ? stStack.length : 0);

      for (let i = 0; i <= steps; i++) {
        const { items, next, storageNext, source } = await loadExplorePage({
          cursor: tmpCursor,
          search: q,
          storageCursor: tmpStorage,
        });
        lastPage = items;
        tmpCursor = next || null;
        tmpStorage = storageNext || null;

        // stop if storage hits the end
        if (source === "storage" && !storageNext) break;
      }

      setItems(lastPage);
      setSource(fsStack ? "firestore" : "storage");
      setCursor(tmpCursor);
      setStorageCursor(tmpStorage);
    } catch {
      setError("Could not load previous page.");
    } finally {
      setLoading(false);
    }
  };

  const hasNext = !!cursor || !!storageCursor;
  const hasPrev =
    fsCursors.current.length > 0 || stCursors.current.length > 0;

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl text-gray-900">{pageTitle}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Showing up to {EXPLORE_PAGE_SIZE} photos per page
              {source === "storage" ? " (via Storage fallback)" : ""}.
            </p>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="search"
              value={search}
              onChange={(e) => {
                // reset stacks when search changes
                fsCursors.current = [];
                stCursors.current = [];
                setCursor(null);
                setStorageCursor(null);
                setSearch(e.target.value);
              }}
              placeholder="Search by title or tag…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading && (
            <div className="text-gray-500 text-sm">Loading photos…</div>
          )}

          {!loading && error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-gray-500 text-sm">No results.</div>
          )}

          {!loading && items.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((photo) => (
                  <ImageCard key={photo.id} photo={photo} />
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    hasPrev
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!hasNext}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    hasNext
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
