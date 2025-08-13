// src/pages/ExplorePage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ref, list, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "@/lib/firebase"; // <-- from src/lib/firebase.js
import ImageCard from "@/components/ImageCard";

const PAGE_SIZE = 24; // how many images per page
const STORAGE_PREFIX = "public/images"; // your folder in Firebase Storage

export default function ExplorePage() {
  const [items, setItems] = useState([]);               // current page items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [tokenStack, setTokenStack] = useState([]);     // to support "Prev"
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");           // newest | oldest | title

  // Keep a ref to know if this is a forward navigation (so we can push token)
  const goingForwardRef = useRef(true);

  // Build a (stable) list() options object
  const listOptions = useMemo(() => {
    const opts = { maxResults: PAGE_SIZE };
    if (nextPageToken) opts.pageToken = nextPageToken;
    return opts;
  }, [nextPageToken]);

  // Fetch a page from Storage
  const fetchPage = async () => {
    setLoading(true);
    setError("");
    try {
      const baseRef = ref(storage, STORAGE_PREFIX);
      const res = await list(baseRef, listOptions);

      // We get only the prefixes/items for this page
      const files = res.items || [];

      // For each file, load metadata + a download URL
      const enriched = await Promise.all(
        files.map(async (fileRef) => {
          const [meta, url] = await Promise.all([
            getMetadata(fileRef),
            getDownloadURL(fileRef),
          ]);

          const cm = meta.customMetadata || {};
          // Fall back when no metadata provided
          const title =
            cm.title ||
            meta.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
          const price = cm.price ? Number(cm.price) : undefined;
          const category =
            (cm.category || cm.categories || "").toString().toLowerCase() ||
            "uncategorized";
          const tags = (cm.tags || "")
            .toString()
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);

          return {
            id: meta.fullPath,
            url,
            title,
            price,
            category,
            tags,
            created: meta.timeCreated ? new Date(meta.timeCreated) : null,
            updated: meta.updated ? new Date(meta.updated) : null,
          };
        })
      );

      // Optional client-side search/filter/sort
      let filtered = enriched;

      if (category !== "all") {
        filtered = filtered.filter((x) => x.category === category);
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (x) =>
            x.title.toLowerCase().includes(q) ||
            (x.tags || []).some((t) => t.includes(q))
        );
      }

      switch (sort) {
        case "oldest":
          filtered = filtered.sort(
            (a, b) => (a.created?.getTime() || 0) - (b.created?.getTime() || 0)
          );
          break;
        case "title":
          filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "newest":
        default:
          filtered = filtered.sort(
            (a, b) => (b.created?.getTime() || 0) - (a.created?.getTime() || 0)
          );
          break;
      }

      setItems(filtered);
      // Save tokens for pagination
      if (goingForwardRef.current) {
        // When going forward we push the new token we *arrived at* so "Prev" can pop it later
        setTokenStack((prev) =>
          res.nextPageToken ? [...prev, res.nextPageToken] : [...prev]
        );
      }
      setNextPageToken(res.nextPageToken || null);
    } catch (e) {
      console.error(e);
      setError("Could not load images.");
    } finally {
      setLoading(false);
    }
  };

  // Initial + whenever filters change => go back to first page
  useEffect(() => {
    // Reset pagination on filter change
    setPage(1);
    setNextPageToken(null);
    setTokenStack([]);
    goingForwardRef.current = true;
  }, [search, category, sort]);

  // Fetch whenever pagination or filters change
  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, nextPageToken, search, category, sort]);

  const canPrev = page > 1;
  const canNext = !!nextPageToken;

  const goPrev = () => {
    if (!canPrev) return;
    goingForwardRef.current = false;
    setPage((p) => Math.max(1, p - 1));

    // When going back, we must reconstruct the token used for the *previous* page.
    // The stack keeps tokens we encountered going forward. Pop once and set as nextPageToken.
    setTokenStack((prev) => {
      const copy = [...prev];
      copy.pop(); // discard current "tip", go to previous token snapshot
      const prevToken = copy[copy.length - 1] ?? null;
      setNextPageToken(prevToken);
      return copy;
    });
  };

  const goNext = () => {
    if (!canNext) return;
    goingForwardRef.current = true;
    setPage((p) => p + 1);
    // nextPageToken is already set by Firebase list() response
    // It will be consumed by fetchPage on next render
  };

  // Basic set of categories (you can adjust to your dataset)
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "streetphotography", label: "Street Photography" },
    { value: "nature", label: "Nature" },
    { value: "city", label: "City" },
    { value: "portrait", label: "Portrait" },
    { value: "uncategorized", label: "Uncategorized" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header spacer for sticky nav (matches Navbar height) */}
      <div className="h-[64px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-extrabold text-center mb-6">
          Explore Photos
        </h1>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <input
            type="search"
            placeholder="Search by title or tag…"
            className="border rounded-md px-3 py-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-md px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            className="border rounded-md px-3 py-2"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>

        {/* State */}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-gray-500">Loading…</div>
        )}

        {/* Grid */}
        {!loading && items.length === 0 && (
          <div className="text-center py-16 text-gray-500">No images found.</div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ImageCard key={item.id} item={item} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className={`px-3 py-2 rounded border ${
              canPrev
                ? "bg-white hover:bg-gray-50"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Prev
          </button>
          <span className="text-sm">Page {page}</span>
          <button
            onClick={goNext}
            disabled={!canNext}
            className={`px-3 py-2 rounded border ${
              canNext
                ? "bg-white hover:bg-gray-50"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
