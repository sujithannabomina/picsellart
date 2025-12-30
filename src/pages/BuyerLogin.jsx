// src/pages/BuyerLogin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerLogin() {
  const navigate = useNavigate();
  const { user, role, loading, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    // If already logged in as buyer, go to dashboard
    if (!loading && user && role === "buyer") {
      navigate("/buyer/dashboard", { replace: true });
    }
  }, [loading, user, role, navigate]);

  async function handleGoogle() {
    setError("");
    const res = await loginWithGoogle("buyer");
    if (!res.ok) {
      setError("Login failed. Please try again.");
      return;
    }
    navigate("/buyer/dashboard", { replace: true });
  }

  return (
    <main className="page">
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 6 }}>Buyer Login</h1>
        <p style={{ color: "#4b5563", marginTop: 0 }}>
          Login to purchase and download watermark-free files. Your buyer dashboard will show your activity.
        </p>

        <div
          style={{
            marginTop: 18,
            borderRadius: 22,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(148,163,184,0.25)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
            padding: 18,
          }}
        >
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
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
            {loading ? "Please wait..." : "Continue with Google"}
          </button>

          {error && (
            <div style={{ marginTop: 10, color: "#b91c1c", fontWeight: 700 }}>
              {error}
            </div>
          )}

          <p style={{ marginTop: 12, color: "#64748b", fontSize: "0.92rem" }}>
            Security note: Picsellart will never ask your password/OTP via email or chat.
          </p>
        </div>
      </section>
    </main>
  );
}
