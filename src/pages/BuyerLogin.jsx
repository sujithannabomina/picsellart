import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BuyerLogin() {
  const { user, isBuyer, loginAsBuyer, loading } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Already logged in as buyer → go to dashboard
  if (user && isBuyer) {
    return <Navigate to="/buyer-dashboard" replace />;
  }

  const handleLogin = async () => {
    setError("");
    try {
      const fbUser = await loginAsBuyer();
      if (fbUser) {
        navigate("/buyer-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Could not sign you in. Please try again.");
    }
  };

  return (
    <div className="page-shell">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 className="page-title">Buyer Login</h1>
        <p className="page-subtitle">
          Sign in to purchase and download high-resolution images you've bought
          on Picsellart.
        </p>

        <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: 18 }}>
          Buyers use a Google account to keep purchases safe across devices.
          Your email is never shared with sellers.
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
          By continuing you agree to receive order notifications and download
          links by email.
        </p>
      </div>
    </div>
  );
}
