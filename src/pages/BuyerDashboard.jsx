// FILE: src/pages/BuyerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { formatINR } from "../utils/plans.js";

function formatDate(d) {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(d);
  } catch {
    return d.toDateString();
  }
}

export default function BuyerDashboard() {
  const nav = useNavigate();
  const { user, userDoc, loading, logout } = useAuth();
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q1 = query(collection(db, "purchases"), where("buyerId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q1, (snap) => {
      setPurchases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const totalSpent = useMemo(() => purchases.reduce((s, p) => s + (Number(p.amountINR || 0) || 0), 0), [purchases]);

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  if (!user) {
    return (
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 18px" }}>
        <h2 style={{ margin: 0, fontWeight: 900 }}>Buyer Dashboard</h2>
        <p style={{ color: "#555" }}>Please login as buyer to continue.</p>
        <button onClick={() => nav("/buyer-login")} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "12px 16px", borderRadius: 12, fontWeight: 900 }}>
          Go to Buyer Login
        </button>
      </div>
    );
  }

  const bp = userDoc?.buyerProfile || {};

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", padding: "30px 18px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 900, fontSize: 34, color: "#111" }}>Buyer Dashboard</h1>
          <div style={{ marginTop: 6, color: "#555" }}>
            Welcome <b>{bp.fullName || userDoc?.displayName || "Buyer"}</b> — manage purchases and downloads.
          </div>
        </div>
        <button
          onClick={async () => {
            await logout();
            nav("/");
          }}
          style={{ background: "#111", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 14, marginTop: 16 }}>
        <div style={{ border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 900, color: "#111" }}>Profile</div>
          <div style={{ marginTop: 10, color: "#555", display: "grid", gap: 6 }}>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Phone:</b> {bp.phone || "-"}</div>
            <div><b>Purpose:</b> {bp.purpose || "-"}</div>
          </div>

          <button
            onClick={() => nav("/explore")}
            style={{ marginTop: 14, background: "#7c3aed", color: "#fff", border: "none", padding: "12px 14px", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}
          >
            Explore Pictures
          </button>
        </div>

        <div style={{ border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 900, color: "#111" }}>Purchases</div>
              <div style={{ color: "#666", marginTop: 6 }}>Your paid purchases and download links.</div>
            </div>
            <div style={{ fontWeight: 900, color: "#111" }}>Total spent: {formatINR(totalSpent)}</div>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {purchases.length === 0 && <div style={{ color: "#666" }}>No purchases yet.</div>}

            {purchases.map((p) => (
              <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 900, color: "#111" }}>{p.title || "Image purchase"}</div>
                  <div style={{ color: "#666", marginTop: 4, fontSize: 13 }}>
                    {p.createdAt?.toDate ? formatDate(p.createdAt.toDate()) : "—"} • Payment: {p.paymentId || "—"}
                  </div>
                  {p.downloadUrl && (
                    <a href={p.downloadUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, color: "#7c3aed", fontWeight: 900, textDecoration: "none" }}>
                      Download
                    </a>
                  )}
                </div>
                <div style={{ fontWeight: 900, color: "#111" }}>{formatINR(p.amountINR || 0)}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 980px){
            div[style*="grid-template-columns: 0.9fr 1.1fr"]{ grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
