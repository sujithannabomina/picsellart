// src/pages/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

function fmt(ts) {
  try {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/buyer/login");
      return;
    }
    (async () => {
      try {
        const purchasesQ = query(
          collection(db, "buyers", user.uid, "purchases"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(purchasesQ);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(list);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Your purchases</h1>
        <p className="page-desc">Downloaded photos and license details.</p>

        {loading ? (
          <div className="card"><div className="card-body">Loading…</div></div>
        ) : (items?.length ?? 0) === 0 ? (
          <div className="card"><div className="card-body">No purchases yet.</div></div>
        ) : (
          <div className="grid grid--3" style={{ marginTop: 16 }}>
            {items.map((it) => (
              <div key={it.id} className="card">
                <div className="card-body">
                  <div className="muted" style={{ fontSize: 13, marginBottom: 4 }}>
                    Order: {it.orderId || it.id}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                    {it.title || "Photo"}
                  </h3>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Date: {fmt(it.createdAt)}
                  </div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Amount: ₹{(it.amount ?? 0) / 100} {it.currency || "INR"}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <a
                      className={`btn ${it.hdUrl ? "btn--brand" : ""}`}
                      href={it.hdUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => { if (!it.hdUrl) e.preventDefault(); }}
                    >
                      {it.hdUrl ? "Download HD" : "Download not ready"}
                    </a>
                    <button className="btn" onClick={() => window.open("/policy", "_blank")}>
                      License Policy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
