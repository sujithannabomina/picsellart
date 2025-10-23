// src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

export default function Explore() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "photos"), orderBy("createdAt", "desc"), limit(60));
      const snap = await getDocs(q);
      const r = [];
      snap.forEach(d => r.push({ id: d.id, ...d.data() }));
      setRows(r);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(x => (x.title || "").toLowerCase().includes(s));
  }, [rows, search]);

  return (
    <main className="section container">
      <h1>Explore Pictures</h1>
      <input
        className="input"
        placeholder="Search by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      {filtered.length === 0 ? (
        <div className="muted">No results.</div>
      ) : (
        <div className="grid">
          {filtered.map(p => (
            <a key={p.id} className="card link" style={{ gridColumn: "span 3" }}
               href={`/photo/${p.id}`} onClick={(e) => { e.preventDefault(); window.location.href = `/photo/${p.id}`; }}>
              <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: 10, background: "#f5f5f7" }}>
                {p.previewUrl ? <img src={p.previewUrl} alt={p.title || "photo"} /> : null}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <div className="muted">{p.title || "Untitled"}</div>
                <div className="muted">₹{Number(p.price || 0).toFixed(2)}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
