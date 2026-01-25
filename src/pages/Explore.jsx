import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage, db } from "../firebase";
import { getDownloadURL, listAll, ref as sref } from "firebase/storage";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { formatINR } from "../utils/plans.js";

function dedupe(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const k = x.uniqueKey || x.id;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}

function WatermarkOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="select-none text-white/40 text-2xl md:text-3xl font-extrabold tracking-[0.3em] rotate-[-20deg] drop-shadow">
        PICSELLART
      </span>
    </div>
  );
}

export default function Explore() {
  const nav = useNavigate();
  const [qText, setQText] = useState("");
  const [sample, setSample] = useState([]);
  const [seller, setSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample images from Firebase Storage: public/images
  useEffect(() => {
    async function loadSamples() {
      setLoading(true);
      try {
        const folder = sref(storage, "public/images");
        const res = await listAll(folder);

        const urls = await Promise.all(
          res.items.map(async (itemRef, idx) => {
            const url = await getDownloadURL(itemRef);
            const filename = itemRef.name;
            const storagePath = `public/images/${filename}`;
            return {
              type: "sample",
              // IMPORTANT: keep sample id encoded ONCE here
              id: `sample-${encodeURIComponent(storagePath)}`,
              uniqueKey: storagePath,
              title: "Street Photography",
              filename,
              priceINR: 120 + (idx % 130),
              previewUrl: url,
              downloadUrl: url,
              sellerId: null,
            };
          })
        );

        setSample(urls);
      } catch (e) {
        console.error(e);
        setSample([]);
      } finally {
        setLoading(false);
      }
    }
    loadSamples();
  }, []);

  // Seller listings from Firestore
  useEffect(() => {
    const q1 = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q1, (snap) => {
      const rows = snap.docs.map((d) => {
        const x = d.data();
        return {
          type: "seller",
          id: d.id,
          uniqueKey: d.id,
          title: x.title,
          filename: x.storagePath?.split("/").pop() || "seller-image",
          priceINR: x.priceINR,
          previewUrl: x.previewUrl,
          downloadUrl: x.previewUrl,
          sellerId: x.sellerId,
        };
      });
      setSeller(rows);
    });
    return () => unsub();
  }, []);

  const all = useMemo(() => {
    const merged = dedupe([...seller, ...sample]);
    const qq = qText.trim().toLowerCase();
    if (!qq) return merged;
    return merged.filter(
      (x) =>
        (x.title || "").toLowerCase().includes(qq) ||
        (x.filename || "").toLowerCase().includes(qq)
    );
  }, [sample, seller, qText]);

  const perPage = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  useEffect(() => setPage(1), [qText]);
  const pageItems = useMemo(
    () => all.slice((page - 1) * perPage, page * perPage),
    [all, page]
  );

  // ✅ FIX: View route exists + avoid double-encoding
  function goView(item) {
    if (item.type === "sample") {
      // Direct photo page like: /photo/sample1.jpg
      nav(`/photo/${encodeURIComponent(item.filename)}`);
      return;
    }
    nav(`/view/${item.id}`, { state: { item } });
  }

  function goBuy(item) {
    const qs =
      `?type=${encodeURIComponent(item.type)}` +
      `&id=${encodeURIComponent(item.id)}` +
      `&title=${encodeURIComponent(item.title || "")}` +
      `&priceINR=${encodeURIComponent(item.priceINR || 0)}` +
      `&sellerId=${encodeURIComponent(item.sellerId || "")}` +
      `&downloadUrl=${encodeURIComponent(item.downloadUrl || "")}`;
    nav(`/checkout${qs}`, { state: { item } });
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 18px 60px" }}>
      <h1 style={{ margin: 0, fontSize: 34, fontWeight: 600, color: "#111" }}>
        Explore Marketplace
      </h1>

      {/* ✅ Removed the yellow-marked subtitle text */}

      <input
        className="psa-input"
        value={qText}
        onChange={(e) => setQText(e.target.value)}
        placeholder="Search street, interior, food..."
        style={{ marginTop: 14 }}
      />

      {loading && (
        <div style={{ marginTop: 16 }} className="psa-muted">
          Loading images...
        </div>
      )}

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {pageItems.map((x) => (
          <div key={x.uniqueKey} className="psa-card" style={{ overflow: "hidden" }}>
            <div style={{ height: 180, background: "#f7f7f7", position: "relative" }}>
              <img
                src={x.previewUrl}
                alt={x.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* ✅ Watermark on Explore */}
              <WatermarkOverlay />
            </div>

            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, color: "#111" }}>{x.title}</div>

              {/* ✅ Removed yellow-marked filename text */}
              {/* ✅ Removed “Payment goes to ...” text */}
              {/* ✅ Removed “Showing 112 items” text (not rendered anymore) */}

              <div style={{ marginTop: 10, fontWeight: 700 }}>
                {formatINR(x.priceINR || 0)}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button onClick={() => goView(x)} className="psa-btn" style={{ flex: 1 }}>
                  View
                </button>
                <button onClick={() => goBuy(x)} className="psa-btn psa-btn-primary" style={{ flex: 1 }}>
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="psa-btn"
          style={{ opacity: page <= 1 ? 0.6 : 1, cursor: page <= 1 ? "not-allowed" : "pointer" }}
        >
          Prev
        </button>
        <div style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>
          Page {page} / {totalPages}
        </div>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="psa-btn"
          style={{ opacity: page >= totalPages ? 0.6 : 1, cursor: page >= totalPages ? "not-allowed" : "pointer" }}
        >
          Next
        </button>
      </div>

      <style>{`
        @media (max-width: 1050px){ div[style*="grid-template-columns: repeat(4, 1fr)"]{ grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px){ div[style*="grid-template-columns: repeat(4, 1fr)"]{ grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
