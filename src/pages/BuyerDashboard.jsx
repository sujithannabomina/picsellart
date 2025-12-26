import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function onLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <main className="page">
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: 0 }}>Buyer Dashboard</h1>
          <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.65 }}>
            Welcome, <b>{user?.displayName || "Buyer"}</b>. Your purchases and downloads will appear here.
          </p>

          <div style={{ marginTop: 12, color: "#64748b", lineHeight: 1.7 }}>
            <div><b>Email:</b> {user?.email || "-"}</div>
            <div><b>UID:</b> {user?.uid || "-"}</div>
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
                boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
              }}
            >
              Explore Pictures
            </button>

            <button
              type="button"
              onClick={onLogout}
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

          <div style={{ marginTop: 16, color: "#334155", lineHeight: 1.7 }}>
            <b>Your Purchases (Coming Next):</b>
            <div style={{ marginTop: 6, color: "#64748b" }}>
              Once Razorpay purchase is connected, we’ll list your bought items here with download buttons.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
