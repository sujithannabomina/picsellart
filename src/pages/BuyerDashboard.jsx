// src/pages/BuyerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const auth = useAuth();

  const wrap = { maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" };
  const card = {
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
    padding: 18,
  };
  const btn = {
    border: "none",
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
    color: "white",
    background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
    boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
  };
  const btnGhost = {
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
    background: "white",
    border: "1px solid #e5e7eb",
    color: "#0f172a",
    marginLeft: 10,
  };

  async function onLogout() {
    await auth.logout();
    navigate("/", { replace: true });
  }

  return (
    <main className="page">
      <section style={wrap}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Buyer Dashboard</h1>
        <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.65, maxWidth: 820 }}>
          Welcome{auth?.user?.displayName ? `, ${auth.user.displayName}` : ""}. Browse the marketplace and purchase files.
        </p>

        <div style={{ marginTop: 16, ...card }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" style={btn} onClick={() => navigate("/explore")}>
              Explore Pictures
            </button>
            <button type="button" style={btnGhost} onClick={onLogout}>
              Logout
            </button>
          </div>

          <div style={{ marginTop: 14, color: "#334155", lineHeight: 1.7 }}>
            <p style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>Status</p>
            <p style={{ margin: "6px 0 0" }}>
              Logged in as: <b>Buyer</b>
            </p>
            <p style={{ margin: "6px 0 0", color: "#64748b" }}>
              (Purchases + downloads can be connected to Razorpay later. UI is stable and production-safe.)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
