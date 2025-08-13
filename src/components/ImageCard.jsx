// src/components/ImageCard.jsx
import React from "react";

export default function ImageCard({ downloadURL, title, price, category, tags }) {
  const safeTitle = title || "Untitled";
  const showPrice =
    typeof price === "number" && !Number.isNaN(price) && price >= 0;

  return (
    <div style={styles.card}>
      <div style={styles.thumbWrap}>
        {downloadURL ? (
          <img src={downloadURL} alt={safeTitle} style={styles.thumb} />
        ) : (
          <div style={styles.thumbFallback}>Image</div>
        )}
        {/* quick watermark-like stripe (preview only) */}
        <div style={styles.watermark}>picsellart</div>
      </div>

      <div style={styles.body}>
        <div style={styles.rowTop}>
          <div style={styles.title} title={safeTitle}>
            {safeTitle}
          </div>
          {showPrice && <div style={styles.price}>₹{price.toFixed(2)}</div>}
        </div>

        <div style={styles.rowBottom}>
          {category && <span style={styles.badge}>{category}</span>}
          {Array.isArray(tags) &&
            tags.slice(0, 2).map((t, i) => (
              <span key={i} style={styles.tag}>
                #{t}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  thumbWrap: {
    position: "relative",
    aspectRatio: "4 / 3",
    background: "#f9fafb",
    overflow: "hidden",
  },
  thumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  thumbFallback: {
    width: "100%",
    height: "100%",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  watermark: {
    position: "absolute",
    left: 0,
    bottom: 10,
    width: "100%",
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
    pointerEvents: "none",
    userSelect: "none",
    // subtle stripe
    background:
      "linear-gradient(90deg, rgba(17,24,39,0) 0%, rgba(17,24,39,0.75) 50%, rgba(17,24,39,0) 100%)",
  },
  body: { padding: 10, display: "grid", gap: 8 },
  rowTop: { display: "flex", justifyContent: "space-between", gap: 8 },
  title: {
    fontWeight: 700,
    fontSize: 15,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "75%",
  },
  price: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    borderRadius: 999,
    padding: "2px 8px",
    fontWeight: 800,
    fontSize: 13,
  },
  rowBottom: { display: "flex", gap: 6, flexWrap: "wrap" },
  badge: {
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    color: "#374151",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
  },
  tag: {
    background: "#eef2ff",
    border: "1px solid #e0e7ff",
    color: "#3730a3",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
  },
};
