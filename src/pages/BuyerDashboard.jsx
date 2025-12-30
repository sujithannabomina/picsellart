// src/pages/BuyerDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, role, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || role !== "buyer")) {
      navigate("/buyer-login", { replace: true });
    }
  }, [loading, user, role, navigate]);

  if (loading) {
    return (
      <main className="page">
        <section style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p>Loading…</p>
        </section>
      </main>
    );
  }

  if (!user) return null;

  const name = user.displayName || "Buyer";

  return (
    <main className="page">
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 26,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(148,163,184,0.25)",
          boxShadow: "0 22px 60px rgba(15,23,42,0.14)",
          padding: 22,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 900 }}>Buyer Dashboard</h1>
        <p style={{ marginTop: 8, color: "#4b5563" }}>
          Welcome, <b>{name}</b>. Your purchases and downloads will appear here.
        </p>

        <div style={{ marginTop: 12, color: "#475569", lineHeight: 1.7 }}>
          <div><b>Email:</b> {user.email || "-"}</div>
          <div><b>UID:</b> {user.uid}</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button
            type="button"
            onClick={() => navigate("/explore")}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
              boxShadow: "0 18px 40px rgba(79, 70, 229, 0.30)",
            }}
          >
            Explore Pictures
          </button>

          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate("/", { replace: true });
            }}
            style={{
              borderRadius: 999,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 800,
              background: "white",
              border: "1px solid #e5e7eb",
              color: "#0f172a",
            }}
          >
            Logout
          </button>
        </div>

        {/* Purchases (clean, professional placeholder) */}
        <div style={{ marginTop: 18 }}>
          <h2 style={{ margin: "10px 0 6px", fontSize: "1.05rem", fontWeight: 900, color: "#0f172a" }}>
            Your Purchases
          </h2>
          <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
            No purchases yet. After checkout, your purchased files will show here with download buttons.
          </p>
        </div>
      </section>
    </main>
  );
}
