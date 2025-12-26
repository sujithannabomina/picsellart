import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SellerLogin() {
  const navigate = useNavigate();
  const { signInSeller } = useAuth();
  const [error, setError] = useState("");

  async function handleGoogle() {
    setError("");
    try {
      await signInSeller();
      navigate("/seller/dashboard", { replace: true });
    } catch (e) {
      setError("Login failed. Please try again.");
      console.error("Seller login error:", e);
    }
  }

  return (
    <main className="page">
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Seller Login</h1>
        <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.65, maxWidth: 900 }}>
          Login to manage your plan, upload images within limits, and track your sales.
        </p>

        <div
          style={{
            marginTop: 18,
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
            padding: 18,
            maxWidth: 900,
          }}
        >
          <button
            type="button"
            onClick={handleGoogle}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              boxShadow: "0 18px 40px rgba(236, 72, 153, 0.25)",
            }}
          >
            Continue with Google
          </button>

          {error && (
            <div style={{ marginTop: 12, color: "#b91c1c", fontWeight: 700 }}>
              {error}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
