// src/pages/BuyerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <main className="page">
      <section style={{ maxWidth: 1120, margin: "0 auto", paddingTop: 24 }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>
            Buyer Dashboard
          </h1>

          <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.7 }}>
            Welcome{user?.displayName ? `, ${user.displayName}` : ""}.  
            This is your dashboard (production-ready login session). Next we’ll connect purchases + downloads here.
          </p>

          <div style={{ marginTop: 12, color: "#64748b", fontSize: "0.95rem" }}>
            <div><b>Email:</b> {user?.email || "-"}</div>
            <div><b>UID:</b> {user?.uid || "-"}</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            <button
              className="btn btn-nav-primary"
              onClick={() => navigate("/explore")}
              type="button"
              style={{ padding: "10px 16px" }}
            >
              Explore Pictures
            </button>

            <button
              className="btn btn-nav"
              onClick={async () => {
                await logout();
                navigate("/", { replace: true });
              }}
              type="button"
              style={{ padding: "10px 16px" }}
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
