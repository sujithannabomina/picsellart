// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        // newest 3 photos
        const q = query(
          collection(db, "photos"),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (isMounted) setPhotos(items);
      } catch (err) {
        if (isMounted) setError(err?.message || "Failed to load photos.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Welcome to Picsellart</h1>
        <p style={styles.subtitle}>
          Your platform for buying and selling creative photos.
        </p>

        <div style={styles.ctaRow}>
          {/* These routes exist in your app: /sell and /explore */}
          <button style={styles.primaryBtn} onClick={() => navigate("/sell")}>
            Seller Login
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/explore")}>
            Buyer Login
          </button>
          <button style={styles.outlineBtn} onClick={() => navigate("/explore")}>
            Explore Pictures
          </button>
        </div>
      </section>

      {/* Latest 3 Preview */}
      <section style={styles.previewSection}>
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {loading ? (
          <div style={styles.grid}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : photos.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            No photos yet. Be the first to{" "}
            <span
              style={{ color: "#2563eb", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/sell")}
            >
              upload
            </span>
            !
          </div>
        ) : (
          <div style={styles.grid}>
            {photos.map((p) => (
              <PreviewCard key={p.id} photo={p} onClick={() => navigate("/explore")} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PreviewCard({ photo, onClick }) {
  const { title, price, category, downloadURL } = photo;
  return (
    <div style={styles.card} onClick={onClick} role="button">
      <div style={styles.thumbWrap}>
        {downloadURL ? (
          <img src={downloadURL} alt={title || "Photo"} style={styles.thumb} />
        ) : (
          <div style={styles.thumbFallback}>Image</div>
        )}
      </div>
      <div style={styles.cardBody}>
        <div style={styles.cardTitle} title={title}>{title || "Untitled"}</div>
        <div style={styles.metaRow}>
          <span style={styles.price}>
            {typeof price === "number" ? `₹${price.toFixed(2)}` : "—"}
          </span>
          {category && <span style={styles.tag}>{category}</span>}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.thumbWrap, background: "#f3f4f6" }} />
      <div style={styles.cardBody}>
        <div style={skeletonBar(18, 70)} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div style={skeletonBar(14, 30)} />
          <div style={skeletonBar(14, 40)} />
        </div>
      </div>
    </div>
  );
}

/* ---- styles ---- */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: 32,
    padding: "32px 16px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  hero: { textAlign: "center", marginTop: 30 },
  title: { fontSize: 42, fontWeight: 800, margin: 0 },
  subtitle: { color: "#4b5563", marginTop: 8, marginBottom: 18, fontSize: 18 },
  ctaRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: baseBtn("#111827", "#ffffff"),
  secondaryBtn: baseBtn("#1f2937", "#ffffff"),
  outlineBtn: {
    ...baseBtn("#ffffff", "#111827"),
    border: "1px solid #d1d5db",
  },
  previewSection: { marginTop: 10 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  thumbWrap: {
    aspectRatio: "4 / 3",
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: { width: "100%", height: "100%", objectFit: "cover" },
  thumbFallback: { color: "#9ca3af", fontSize: 14 },
  cardBody: { padding: 12 },
  cardTitle: {
    fontWeight: 700,
    fontSize: 16,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  price: {
    background: "#ecfdf5",
    color: "#065f46",
    border: "1px solid #a7f3d0",
    fontSize: 13,
    fontWeight: 700,
    padding: "4px 8px",
    borderRadius: 999,
  },
  tag: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: "center",
  },
};

function baseBtn(bg, fg) {
  return {
    background: bg,
    color: fg,
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  };
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
