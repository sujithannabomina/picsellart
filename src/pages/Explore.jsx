// FILE: src/pages/Explore.jsx
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

export default function Explore() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [sample, setSample] = useState([]);
  const [seller, setSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load sample images ONLY from: storage/public/images
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

  // Live seller listings
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
    const merged = dedupe([...seller, ...sample]); // seller first, then sample
    const qq = q.trim().toLowerCase();
    if (!qq) return merged;
    return merged.filter(
      (x) =>
        (x.title || "").toLowerCase().includes(qq) ||
        (x.filename || "").toLowerCase().includes(qq)
    );
  }, [sample, seller, q]);

  // Simple pagination (front-end)
  const perPage = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  useEffect(() => setPage(1), [q]);

  const pageItems = useMemo(
    () => all.slice((page - 1) * perPage, page * perPage),
    [all, page]
  );

  function goView(item) {
    nav(`/view/${encodeURIComponent(item.id)}`, { state: { item } });
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
    <div className="psa-wrap">
      {/* Header */}
      <div className="psa-head">
        <h1 className="psa-h1">Explore Marketplace</h1>
        <p className="psa-sub">
          Curated sample gallery + verified sellers. Buy securely and manage downloads in your Buyer Dashboard.
        </p>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search street, interior, food..."
          className="psa-search"
        />

        {loading && <div className="psa-loading">Loading images...</div>}
      </div>

      {/* Grid */}
      <div className="psa-grid">
        {pageItems.map((x) => (
          <div key={x.uniqueKey} className="psa-card">
            <button className="psa-imgWrap" onClick={() => goView(x)} title="View">
              <img src={x.previewUrl} alt={x.title} className="psa-img" />
            </button>

            <div className="psa-body">
              <div className="psa-title">{x.title}</div>
              <div className="psa-file">{x.filename}</div>
              <div className="psa-price">{formatINR(x.priceINR || 0)}</div>

              <div className="psa-actions">
                <button onClick={() => goView(x)} className="psa-btn psa-btnGhost">
                  View
                </button>
                <button onClick={() => goBuy(x)} className="psa-btn psa-btnPrimary">
                  Buy
                </button>
              </div>

              <div className="psa-meta">
                {x.type === "sample" ? "Standard digital license" : "Verified seller listing"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="psa-pagi">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="psa-pageBtn"
        >
          Prev
        </button>

        <div className="psa-pageText">
          Page <span>{page}</span> / <span>{totalPages}</span>
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="psa-pageBtn"
        >
          Next
        </button>
      </div>

      {/* Styles (only affects this page) */}
      <style>{`
        /* Neat font + lighter weights everywhere */
        .psa-wrap{
          max-width: 1100px;
          margin: 0 auto;
          padding: 30px 18px 60px;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
          color: #0f172a;
        }
        .psa-head{ margin-bottom: 18px; }
        .psa-h1{
          margin: 0;
          font-weight: 650;        /* was 900 */
          letter-spacing: -0.02em;
          font-size: 34px;
          color: #0f172a;
        }
        .psa-sub{
          color: #64748b;
          margin-top: 8px;
          line-height: 1.65;
          font-size: 14.5px;
          font-weight: 400;
        }
        .psa-search{
          width: 100%;
          max-width: 520px;
          padding: 12px 14px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          margin-top: 14px;
          outline: none;
          font-size: 14px;
          color: #0f172a;
          background: #fff;
          box-shadow: 0 1px 0 rgba(0,0,0,0.02);
        }
        .psa-search:focus{
          border-color: #c4b5fd;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.12);
        }
        .psa-loading{ margin-top: 12px; color: #64748b; font-size: 14px; }

        .psa-grid{
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .psa-card{
          border: 1px solid #eef2f7;
          border-radius: 18px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 10px 24px rgba(15,23,42,0.06);
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .psa-card:hover{
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(15,23,42,0.10);
        }

        .psa-imgWrap{
          width: 100%;
          height: 180px;
          background: #f1f5f9;
          border: 0;
          padding: 0;
          cursor: pointer;
          display: block;
        }
        .psa-img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .psa-body{ padding: 14px; }
        .psa-title{
          font-weight: 600;        /* was 900 */
          color: #0f172a;
          font-size: 16px;
          letter-spacing: -0.01em;
        }
        .psa-file{
          color: #64748b;
          margin-top: 4px;
          font-size: 12.5px;
          font-weight: 400;
        }
        .psa-price{
          margin-top: 8px;
          font-weight: 650;        /* was 900 */
          font-size: 15px;
          color: #0f172a;
        }

        .psa-actions{
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
        .psa-btn{
          flex: 1;
          padding: 10px 12px;
          border-radius: 999px;   /* smoother */
          font-weight: 600;       /* was 900 */
          font-size: 13.5px;
          cursor: pointer;
          transition: transform .06s ease, background .12s ease, border-color .12s ease;
        }
        .psa-btn:active{ transform: scale(0.98); }

        .psa-btnGhost{
          background: #fff;
          border: 1px solid #e5e7eb;
          color: #0f172a;
        }
        .psa-btnGhost:hover{ background: #f8fafc; }

        .psa-btnPrimary{
          background: #7c3aed;
          color: #fff;
          border: none;
        }
        .psa-btnPrimary:hover{ background: #6d28d9; }

        .psa-meta{
          margin-top: 10px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 400;
        }

        .psa-pagi{
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 18px;
          flex-wrap: wrap;
          align-items: center;
        }
        .psa-pageBtn{
          background: #fff;
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          border-radius: 999px;
          font-weight: 600;       /* was 900 */
          font-size: 13.5px;
          cursor: pointer;
          color: #0f172a;
          transition: background .12s ease, opacity .12s ease;
        }
        .psa-pageBtn:hover{ background: #f8fafc; }
        .psa-pageBtn:disabled{
          cursor: not-allowed;
          opacity: 0.55;
        }
        .psa-pageText{
          padding: 10px 14px;
          font-weight: 500;       /* was 900 */
          color: #334155;
          font-size: 13.5px;
        }
        .psa-pageText span{
          font-weight: 650;
          color: #0f172a;
        }

        /* Responsive */
        @media (max-width: 1050px){
          .psa-grid{ grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px){
          .psa-grid{ grid-template-columns: 1fr; }
          .psa-h1{ font-size: 28px; }
        }
      `}</style>
    </div>
  );
}
