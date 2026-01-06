// FILE: src/pages/ViewPhoto.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { formatINR } from "../utils/plans.js";

export default function ViewPhoto() {
  const nav = useNavigate();
  const { id } = useParams();
  const loc = useLocation();

  const [item, setItem] = useState(loc.state?.item || null);
  const [loading, setLoading] = useState(!loc.state?.item);

  // id can be: sample-public/images/sample16.jpg   OR listing Firestore id
  const isSample = useMemo(() => (id || "").startsWith("sample-"), [id]);

  useEffect(() => {
    async function load() {
      if (item) return;
      setLoading(true);

      try {
        if (isSample) {
          const storagePath = decodeURIComponent(id.replace("sample-", ""));
          const url = await getDownloadURL(ref(storage, storagePath));
          setItem({
            type: "sample",
            id,
            title: "Street Photography",
            priceINR: 136,
            downloadUrl: url,
            previewUrl: url,
            storagePath,
            sellerId: null,
          });
        } else {
          const snap = await getDoc(doc(db, "listings", id));
          if (!snap.exists()) throw new Error("Listing not found");
          const d = snap.data();
          setItem({
            type: "seller",
            id,
            title: d.title,
            priceINR: d.priceINR,
            previewUrl: d.previewUrl,
            downloadUrl: d.previewUrl,
            sellerId: d.sellerId,
          });
        }
      } catch (e) {
        alert(e.message || "Failed to load image");
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
  if (!item) return <div style={{ padding: 30 }}>Not found</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "26px 18px 70px" }}>
      <button onClick={() => nav(-1)} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", fontWeight: 800 }}>
        ← Back
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline", marginTop: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 900, fontSize: 34, color: "#111" }}>{item.title}</h1>
          <div style={{ color: "#666", marginTop: 6 }}>{item.type === "sample" ? "Standard digital license" : "Verified seller listing"}</div>
        </div>
        <div style={{ fontWeight: 900, fontSize: 22, color: "#111" }}>{formatINR(item.priceINR)}</div>
      </div>

      <div
        style={{
          marginTop: 14,
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid #eee",
          background: "#fff",
          boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f7f7f7" }}>
          <img
            src={item.previewUrl}
            alt={item.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Light watermark overlay (preview only) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
              opacity: 0.12,
              fontWeight: 900,
              fontSize: 44,
              color: "#111",
              transform: "rotate(-18deg)",
            }}
          >
            PicSellart
          </div>
        </div>

        <div style={{ padding: 16, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-start" }}>
          <button
            onClick={() => nav("/checkout?type=" + encodeURIComponent(item.type) + "&id=" + encodeURIComponent(item.id) + "&title=" + encodeURIComponent(item.title) + "&priceINR=" + encodeURIComponent(item.priceINR) + "&sellerId=" + encodeURIComponent(item.sellerId || "") + "&downloadUrl=" + encodeURIComponent(item.downloadUrl || ""), { state: { item } })}
            style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "12px 16px", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}
          >
            Buy Now
          </button>
          <button onClick={() => nav(-1)} style={{ background: "#fff", color: "#111", border: "1px solid #eee", padding: "12px 16px", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
