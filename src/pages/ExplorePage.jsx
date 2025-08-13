import { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "../lib/firebase"; // <- make sure this exports your initialized app

const db = getFirestore(app);
const storage = getStorage(app);

const PAGE_SIZE = 20;

export default function ExplorePage() {
  // UI state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest"); // newest | priceLow | priceHigh
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const cursors = useRef([]); // stack of last docs per page for cursor pagination
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Build Firestore query each time filters/sort change
  const buildQuery = useMemo(() => {
    const base = [where("isPublic", "==", true)];

    // category filter
    if (category !== "all") base.push(where("category", "==", category));

    // search: split by spaces, we’ll do very simple tag search via array-contains-any
    // If user typed something, try tags. For titles we’ll do client filter fallback.
    const terms = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    let q;
    if (terms.length > 0) {
      // Limit to first 10 terms for safety
      const searchTerms = terms.slice(0, 10);
      // If you never store tags, comment this line out and rely on client title filter
      q = query(
        collection(db, "photos"),
        ...base,
        where("tags", "array-contains-any", searchTerms),
        orderBy(sort === "newest" ? "createdAt" : "price", sort === "priceHigh" ? "desc" : "asc"),
        limit(PAGE_SIZE + 1)
      );
    } else {
      q = query(
        collection(db, "photos"),
        ...base,
        orderBy(sort === "newest" ? "createdAt" : "price", sort === "priceHigh" ? "desc" : "asc"),
        limit(PAGE_SIZE + 1)
      );
    }
    return q;
  }, [category, search, sort]);

  // Load first page and subscribe for live changes within current page window
  useEffect(() => {
    let unsub = () => {};
    let isMounted = true;

    async function loadFirstPage() {
      setLoading(true);
      setPage(1);
      cursors.current = [];
      setHasPrev(false);

      // one-time fetch to get first page & next existence
      const snap = await getDocs(buildQuery);
      if (!isMounted) return;

      const docs = snap.docs.slice(0, PAGE_SIZE);
      setHasNext(snap.docs.length > PAGE_SIZE);
      cursors.current[1] = docs.at(-1) || null;

      // live subscription only for the current page window (first PAGE_SIZE docs)
      const ids = new Set(docs.map((d) => d.id));
      unsub = onSnapshot(buildQuery, async (live) => {
        // Keep only first PAGE_SIZE docs for current page
        const limited = live.docs.slice(0, PAGE_SIZE);
        // map to objects + resolve URLs
        const rows = await Promise.all(
          limited.map(async (d) => {
            const data = d.data();
            const url = data.publicUrl
              ? data.publicUrl
              : await getDownloadURL(ref(storage, data.storagePath));
            return { id: d.id, ...data, url };
          })
        );

        // optional client-side title filter when search has text
        const titleTerms = search
          .trim()
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);
        const filtered =
          titleTerms.length > 0
            ? rows.filter((r) =>
                titleTerms.every((t) => (r.title || "").toLowerCase().includes(t))
              )
            : rows;

        setPhotos(filtered);
        setLoading(false);
      });
    }

    loadFirstPage();

    return () => {
      isMounted = false;
      unsub();
    };
  }, [buildQuery, search]);

  // Paging: next
  const goNext = async () => {
    if (!hasNext) return;
    setLoading(true);
    const lastDoc = cursors.current[page];
    const q = query(buildQuery, startAfter(lastDoc));
    const snap = await getDocs(q);
    const docs = snap.docs.slice(0, PAGE_SIZE);
    setHasNext(snap.docs.length > PAGE_SIZE);
    setHasPrev(true);
    cursors.current[page + 1] = docs.at(-1) || null;

    const rows = await Promise.all(
      docs.map(async (d) => {
        const data = d.data();
        const url = data.publicUrl
          ? data.publicUrl
          : await getDownloadURL(ref(storage, data.storagePath));
        return { id: d.id, ...data, url };
      })
    );
    setPhotos(rows);
    setPage((p) => p + 1);
    setLoading(false);
  };

  // Paging: prev (re-fetch that window)
  const goPrev = async () => {
    if (!hasPrev || page <= 1) return;
    setLoading(true);
    const prevPage = page - 1;

    // Rebuild the docs up to prevPage
    let q = buildQuery;
    let snap = await getDocs(q);
    let allDocs = snap.docs;

    // Walk pages to previous cursor
    while (allDocs.length > PAGE_SIZE && cursors.current[prevPage - 1]) {
      q = query(buildQuery, startAfter(cursors.current[prevPage - 1]));
      snap = await getDocs(q);
      allDocs = snap.docs;
    }

    const docs = allDocs.slice(0, PAGE_SIZE);
    setHasNext(allDocs.length > PAGE_SIZE);
    setHasPrev(prevPage > 1);
    const rows = await Promise.all(
      docs.map(async (d) => {
        const data = d.data();
        const url = data.publicUrl
          ? data.publicUrl
          : await getDownloadURL(ref(storage, data.storagePath));
        return { id: d.id, ...data, url };
      })
    );
    setPhotos(rows);
    setPage(prevPage);
    setLoading(false);
  };

  return (
    <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", margin: "12px 0 24px" }}>
        Explore Photos
      </h1>

      {/* Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 200px", gap: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or tag…"
          style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
        >
          <option value="all">All Categories</option>
          <option value="Street">Street</option>
          <option value="Nature">Nature</option>
          <option value="Portrait">Portrait</option>
          <option value="Travel">Travel</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
        >
          <option value="newest">Newest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ textAlign: "center", padding: 40 }}>Loading…</p>
      ) : photos.length === 0 ? (
        <p style={{ textAlign: "center", padding: 40 }}>No images found.</p>
      ) : (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {photos.map((p) => (
            <article
              key={p.id}
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ aspectRatio: "4/3", background: "#f4f5f7" }}>
                {p.url && (
                  <img
                    src={p.url}
                    alt={p.title || "photo"}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                )}
              </div>
              <div style={{ padding: 12 }}>
                <h3 style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 16 }}>
                  {p.title || "Untitled"}
                </h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 12,
                      background: "#e7f7ee",
                      color: "#0f7b4c",
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontWeight: 700,
                    }}
                  >
                    ₹{Number(p.price || 0).toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      background: "#eef2ff",
                      color: "#3730a3",
                      padding: "4px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {p.category || "Uncategorized"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: hasPrev ? "#fff" : "#f9fafb",
            cursor: hasPrev ? "pointer" : "not-allowed",
          }}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={goNext}
          disabled={!hasNext}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: hasNext ? "#fff" : "#f9fafb",
            cursor: hasNext ? "pointer" : "not-allowed",
          }}
        >
          Next
        </button>
      </div>
    </main>
  );
}
