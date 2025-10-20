// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../firebase"; // your existing initialized storage

const PAGE_SIZE = 24;
const SAMPLE_COUNT = 112;

/**
 * Builds ref paths we’ll try to list:
 *  - "public/" (common bucket for samples + user-approved uploads)
 *  - "Buyer/"  (if you also mirror public items here; listing may be denied by rules — we ignore errors)
 */
const PATHS = ["public/", "Buyer/"];

/** create sample file names sample1.jpg ... sample112.jpg under "public/" */
function buildSampleRefs() {
  return Array.from({ length: SAMPLE_COUNT }, (_, i) => `public/sample${i + 1}.jpg`);
}

/** Fetch a unique set of candidate refs by trying to list folders if rules allow; otherwise fall back to samples */
async function collectRefs() {
  const set = new Set();
  // try listing folders (best effort)
  for (const p of PATHS) {
    try {
      const listing = await listAll(ref(storage, p));
      listing.items.forEach((it) => set.add(it.fullPath));
    } catch {
      // ignore permission errors
    }
  }
  // ensure samples exist even if listing blocked
  buildSampleRefs().forEach((p) => set.add(p));
  return Array.from(set);
}

/** Fetch download URL with caching */
const urlCache = new Map();
async function toCard(path) {
  if (!urlCache.has(path)) {
    try {
      const url = await getDownloadURL(ref(storage, path));
      urlCache.set(path, url);
    } catch {
      // missing in bucket – skip by storing null to avoid repeated calls
      urlCache.set(path, null);
    }
  }
  const url = urlCache.get(path);
  if (!url) return null;

  // Title & price rules
  const title = "street photography";
  // Deterministic pseudo-random price (₹49–₹249) derived from filename
  const seed = Array.from(path).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const price = 49 + (seed % 201);

  return { id: path, url, title, price };
}

export default function Explore() {
  const [all, setAll] = useState([]);      // all cards
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  useEffect(() => {
    let ok = true;
    (async () => {
      const paths = await collectRefs();
      // Fetch in parallel but keep order stable
      const results = await Promise.all(paths.map((p) => toCard(p)));
      const cards = results.filter(Boolean);
      if (ok) setAll(cards);
    })();
    return () => { ok = false; };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((c) => c.title.toLowerCase().includes(needle));
  }, [q, all]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const current = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => { if (page > pageCount) setPage(1); }, [pageCount]); // reset if filter shrinks

  return (
    <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <h1 style={{ fontSize: 40, margin: "10px 0" }}>Explore Pictures</h1>
        <input
          className="input"
          placeholder="Search by title or tag..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {current.length === 0 ? (
        <p style={{ color: "#64748b", marginTop: 16 }}>No results.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 18,
          }}
        >
          {current.map((item) => (
            <div key={item.id} style={{ position: "relative" }}>
              <img
                src={item.url}
                alt={item.title}
                style={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 12, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* watermark overlay */}
              <div className="watermark">Demo · Picsellart</div>

              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color: "#475569", fontSize: 14 }}>₹{item.price}</div>
                </div>
                <button className="btn-outline" onClick={() => alert("Login to buy in this demo.")}>
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      {pageCount > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18 }}>
          <button className="btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </button>
          <div style={{ padding: "10px 14px" }}>
            Page {page} of {pageCount}
          </div>
          <button className="btn-outline" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
