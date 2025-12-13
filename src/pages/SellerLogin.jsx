// src/pages/SellerLogin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SellerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [error, setError] = useState("");

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("next") || "/seller/dashboard";
  }, [location.search]);

  useEffect(() => {
    if (auth?.user && auth.role === "seller") navigate("/seller/dashboard", { replace: true });
    if (auth?.user && auth.role === "buyer") navigate("/buyer/dashboard", { replace: true });
  }, [auth?.user, auth?.role, navigate]);

  async function onSellerGoogle() {
    try {
      setError("");
      await auth.loginAsSeller();
      navigate(nextPath, { replace: true });
    } catch (e) {
      console.error(e);
      setError("Login failed. Please try again.");
    }
  }

  const wrap = { maxWidth: 980, margin: "0 auto", padding: "28px 16px 64px" };
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
    background: "linear-gradient(90deg, rgba(112,63,247,1) 0%, rgba(236,72,153,1) 100%)",
    boxShadow: "0 18px 40px rgba(236, 72, 153, 0.25)",
  };

  return (
    <main className="page">
      <section style={wrap}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Seller Login</h1>
        <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.65, maxWidth: 820 }}>
          Login to manage your plan, upload images within limits, and track your sales.
        </p>

        <div style={{ marginTop: 16, ...card }}>
          <button type="button" style={btn} onClick={onSellerGoogle}>
            Continue with Google
          </button>

          {error && (
            <div style={{ marginTop: 12, color: "#b91c1c", fontWeight: 600 }}>
              {error}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
