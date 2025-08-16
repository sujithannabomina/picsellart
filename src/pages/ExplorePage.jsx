import React, { useEffect, useMemo, useState } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../lib/firebase"; // <-- change to "../firebase" if that's your path

// ----- Small helpers ---------------------------------------------------------
const PAGE_SIZE = 12;

function niceTitleFromFile(name) {
  // "street_photography-12.jpg" -> "Street Photography 12"
  const base = name.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function currencyINR(value) {
  // show ₹999.00 ; if not a number, return empty string
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `₹${n.toFixed(2)}`;
  }
}

// ----- Card ------------------------------------------------------------------
function PhotoCard({ item }) {
  return (
    <div style={styles.card}>
      <div style={styles.thumbWrap}>
        <img src={item.url} alt={item.title} style={styles.thumb} loading="lazy" />
      </div>
      <div style={styles.cardBody}>
        <div style={styles.title} title={item.title}>{item.title}</div>

        <div style={styles.badgeRow}>
          {item.price != null && (
            <span style={styles.badgePrice}>{currencyINR(item.price)}</span>
          )}
          {item.category && <span style={styles.badge}>{item.category}</span>}
        </div>
      </div>
    </div>
  );
}

// ----- Main Page -------------------------------------------------------------
export default function ExplorePage() {
  const [raw, setRaw] = useState([]);        // all items from storage
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // controls
  const [q, setQ] = useState("");            // search
  const [cat, setCat] = useState("All");     // category
  const [sort, setSort] = useState("newest");// sort key
  const [page, setPage] = useState(1);

  // 1) Load from Firebase Storage
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const listRef = ref(storage, "public/images/");
        const { items } = await listAll(listRef);

        // Fetch URL + metadata in parallel for each file
        const full = await Promise.all(
          items.map(async (it) => {
            const [url, meta] = await Promise.all([
              getDownloadURL(it),
              getMetadata(it).catch(() => null), // metadata may fail for some objects
            ]);

            // Prefer customMetadata if provided by sellers / function
            const cm = meta?.customMetadata || {};
            const title =
              cm.title?.trim() ||
              niceTitleFromFile(it.name); // fallback to filename

            const category = (cm.category || "").trim() || "";
            const price = cm.price != null ? Number(cm.price) : null;
            const tags =
              (cm.tags || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean) || [];

            const updated = meta?.updated ? new Date(meta.updated) : new Date();

            return {
              name: it.name,
              url,
              title,
              category,
              price,
              tags,
              updated,
            };
          })
        );

        if (isMounted) setRaw(full);
      } catch (e) {
        console.error(e);
        if (isMounted) setErr("Couldn’t load images. Check Storage rules and path.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2) Build category list from data
  const categories = useMemo(() => {
    const set = new Set();
    raw.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [raw]);

  // 3) Filter + sort
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    let list = raw.filter((i) => {
      const hitsQ =
        !qLower ||
        i.title.toLowerCase().includes(qLower) ||
        i.tags.some((t) => t.toLowerCase().includes(qLower)) ||
        i.name.toLowerCase().includes(qLower);

      const hitsCat = cat === "All" || (!i.category && cat === "Uncategorized") || i.category === cat;

      return hitsQ && hitsCat;
    });

    switch (sort) {
      case "newest":
        list.sort((a, b) => b.updated - a.updated);
        break;
      case "oldest":
        list.sort((a, b) => a.updated - b.updated);
        break;
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "priceLow":
        list.sort(
          (a, b) =>
            (a.price ?? Number.POSITIVE_INFINITY) -
            (b.price ?? Number.POSITIVE_INFINITY)
        );
        break;
      case "priceHigh":
        list.sort(
          (a, b) =>
            (b.price ?? Number.NEGATIVE_INFINITY) -
            (a.price ?? Number.NEGATIVE_INFINITY)
        );
        break;
      default:
        break;
    }

    return list;
  }, [raw, q, cat, sort]);

  // 4) Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    // if filters change, reset to page 1
    setPage(1);
  }, [q, cat, sort]);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ----- UI ------------------------------------------------------------------
  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Explore Photos</h1>

      <div style={styles.toolbar}>
        <input
          type="search"
          placeholder="Search by title or tag…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={styles.search}
        />

        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={styles.select}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          {!categories.includes("Uncategorized") && (
            <option value="Uncategorized">Uncategorized</option>
          )}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={styles.select}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {loading && <div style={styles.info}>Loading…</div>}
      {err && !loading && <div style={styles.error}>{err}</div>}

      {!loading && !err && filtered.length === 0 && (
        <div style={styles.info}>No images found.</div>
      )}

      <div style={styles.grid}>
        {paged.map((item) => (
          <PhotoCard key={item.name} item={item} />
        ))}
      </div>

      {!loading && filtered.length > 0 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              ...styles.pageBtn,
              ...(page <= 1 ? styles.pageBtnDisabled : {}),
            }}
          >
            ◀ Prev
          </button>
          <span style={styles.pageText}>
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={{
              ...styles.pageBtn,
              ...(page >= totalPages ? styles.pageBtnDisabled : {}),
            }}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

// ----- Simple CSS (inline so you don’t need a CSS file) ----------------------
const styles = {
  wrap: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "24px 16px",
  },
  h1: {
    fontSize: 36,
    fontWeight: 800,
    textAlign: "center",
    margin: "8px 0 24px",
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: "1fr 200px 200px",
    gap: 12,
    marginBottom: 16,
  },
  search: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #D5D8DC",
    fontSize: 16,
    outline: "none",
  },
  select: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #D5D8DC",
    fontSize: 16,
    outline: "none",
    background: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat( auto-fill, minmax(240px, 1fr) )",
    gap: 16,
  },
  card: {
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },
  thumbWrap: {
    width: "100%",
    aspectRatio: "4 / 3",
    background: "#F2F4F7",
    overflow: "hidden",
  },
  thumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardBody: {
    padding: 12,
  },
  title: {
    fontWeight: 700,
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  badgeRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    background: "#EEF2FF",
    color: "#3949AB",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
  },
  badgePrice: {
    background: "#E8FFF1",
    color: "#0F9D58",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 18,
  },
  pageBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #D5D8DC",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  pageBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  pageText: {
    fontSize: 14,
    color: "#4B5563",
  },
  info: {
    textAlign: "center",
    color: "#6B7280",
    margin: "24px 0",
  },
  error: {
    textAlign: "center",
    color: "#B00020",
    margin: "24px 0",
    fontWeight: 600,
  },
};

// ----- Mobile layout tweak ---------------------------------------------------
const mq = window.matchMedia?.("(max-width: 720px)");
if (mq && mq.matches) {
  styles.toolbar.gridTemplateColumns = "1fr";
}
