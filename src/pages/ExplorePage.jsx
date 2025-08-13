// src/pages/ExplorePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import ImageCard from "../components/ImageCard";

const PAGE_SIZE = 25;

export default function ExplorePage() {
  const [allPhotos, setAllPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("newest"); // newest|priceLow|priceHigh|title
  const [page, setPage] = useState(1);

  // live subscription
  useEffect(() => {
    setLoading(true);
    setErr("");

    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setAllPhotos(items);
        setLoading(false);
      },
      (e) => {
        setErr(e?.message || "Failed to load photos.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // filter + sort
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let list = allPhotos;

    if (s) {
      list = list.filter((p) => {
        const title = (p.title || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
        return (
          title.includes(s) ||
          category.includes(s) ||
          tags.includes(s)
        );
      });
    }

    switch (sortKey) {
      case "priceLow":
        list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceHigh":
        list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "title":
        list = [...list].sort((a, b) =>
          (a.title || "").localeCompare(b.title || "", undefined, {
            sensitivity: "base",
          })
        );
        break;
      case "newest":
      default:
        // already newest first from query, but if some are missing timestamps, keep stable
        list = [...list].sort((a, b) => {
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });
        break;
    }

    return list;
  }, [allPhotos, search, sortKey]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    // keep page in range when data changes
    if (page > pageCount) setPage(pageCount);
  }, [pageCount, page]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>Explore Photos</h1>

      {/* Controls */}
      <div style={styles.toolbar}>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title, tag or category…"
          style={styles.input}
        />

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          style={styles.select}
        >
          <option value="newest">Newest</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
          <option value="title">Title A → Z</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <GridSkeleton />
      ) : err ? (
        <div style={styles.errorBox}>{err}</div>
      ) : paged.length === 0 ? (
        <div style={styles.empty}>
          No results. Try a different search or{" "}
          <span style={styles.linkLike} onClick={() => setSearch("")}>
            clear filters
          </span>
          .
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {paged.map((p) => (
              <ImageCard
                key={p.id}
                title={p.title}
                price={p.price}
                category={p.category}
                tags={p.tags}
                downloadURL={p.downloadURL}
              />
            ))}
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              onClick={() => setPage((x) => Math.max(1, x - 1))}
              disabled={page <= 1}
            >
              ← Prev
            </button>
            <div style={styles.pageInfo}>
              Page {page} / {pageCount}
            </div>
            <button
              style={styles.pageBtn}
              onClick={() => setPage((x) => Math.min(pageCount, x + 1))}
              disabled={page >= pageCount}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- styles ---------- */
const styles = {
  wrap: {
    maxWidth: 1150,
    margin: "0 auto",
    padding: "24px 16px 40px",
  },
  title: {
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    margin: "8px 0 18px",
  },
  toolbar: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: 240,
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    background: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 14,
  },
  pagination: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  pageBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    minWidth: 90,
    disabled: {
      background: "#e5e7eb",
      color: "#9ca3af",
      cursor: "not-allowed",
    },
  },
  pageInfo: { fontWeight: 700 },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    padding: "40px 0",
  },
  linkLike: {
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: 12,
    borderRadius: 8,
    textAlign: "center",
  },
};

function GridSkeleton() {
  return (
    <div style={styles.grid}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ aspectRatio: "4/3", background: "#f3f4f6" }} />
          <div style={{ padding: 12 }}>
            <div style={skeletonBar(18, 70)} />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <div style={skeletonBar(14, 30)} />
              <div style={skeletonBar(14, 40)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function skeletonBar(h, wPct) {
  return {
    height: h,
    width: `${wPct}%`,
    borderRadius: 6,
    background:
      "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%)",
    backgroundSize: "400% 100%",
    animation: "pulse 1.4s ease infinite",
  };
}
