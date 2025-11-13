import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { user, isSeller, loginAsSeller, loading } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Already logged in as seller → go straight to seller dashboard
  if (user && isSeller) {
    return <Navigate to="/seller-dashboard" replace />;
  }

  const handleLogin = async () => {
    setError("");
    try {
      const fbUser = await loginAsSeller();
      if (fbUser) {
        // After a future plan-payment flow we may redirect to a plan page first.
        navigate("/seller-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Could not sign you in as seller. Please try again.");
    }
  };

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 className="page-title">Seller Login</h1>
        <p className="page-subtitle">
          Upload and manage your photos, track downloads, and view your plan
          limits.
        </p>

        <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: 18 }}>
          Use your Google account to verify identity. We never show your email
          publicly—only buyers see your image details and prices.
        </p>

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginBottom: 10 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connecting…" : "Continue with Google"}
        </button>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: 6 }}>
            {error}
          </p>
        )}

        <p
          style={{
            fontSize: "0.78rem",
            color: "#94a3b8",
            marginTop: 18,
            lineHeight: 1.5,
          }}
        >
          After login you’ll be able to choose or renew a plan, upload images
          within your limits, and download your stats anytime.
        </p>
      </div>
    </div>
  );
}
