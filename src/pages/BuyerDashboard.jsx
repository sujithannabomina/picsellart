// src/pages/BuyerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <div className="card">
        <h1>Buyer Dashboard</h1>
        <p style={{ color: "#4b5563" }}>
          Welcome, <b>{user?.displayName || "Buyer"}</b>. Your purchases and downloads will appear here.
        </p>

        <div style={{ marginTop: 10, color: "#6b7280" }}>
          <div>
            <b style={{ color: "#374151" }}>Email:</b> {user?.email}
          </div>
          <div>
            <b style={{ color: "#374151" }}>UID:</b> {user?.uid}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <button className="btn btn-nav-primary" onClick={() => navigate("/explore")}>
            Explore Pictures
          </button>
          <button className="btn btn-nav" onClick={logout}>
            Logout
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <h3 style={{ marginBottom: 6 }}>My Purchases</h3>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Once checkout is enabled, your purchased items will appear here with download buttons.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
