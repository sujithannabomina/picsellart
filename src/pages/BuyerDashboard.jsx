// src/pages/BuyerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <main className="page">
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, margin: 0 }}>Buyer Dashboard</h1>
          <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.7 }}>
            Welcome, <b>{user?.displayName || "Buyer"}</b> ({user?.email})
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/explore")}
              className="btn btn-primary"
              style={{ padding: "10px 16px" }}
            >
              Explore Pictures
            </button>
            <button
              onClick={logout}
              className="btn btn-nav"
              style={{ padding: "10px 16px" }}
            >
              Logout
            </button>
          </div>

          <div style={{ marginTop: 18, color: "#64748b", lineHeight: 1.7 }}>
            Purchases/Downloads will appear here once Razorpay + download delivery is wired.
          </div>
        </div>
      </section>
    </main>
  );
}
