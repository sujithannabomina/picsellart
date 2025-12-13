// src/pages/BuyerLogin.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsBuyer } = useAuth();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const redirectTo = location.state?.from?.pathname || "/buyer/dashboard";

  const onLogin = async () => {
    try {
      setErr("");
      setBusy(true);
      await loginAsBuyer();
      navigate(redirectTo, { replace: true });
    } catch (e) {
      console.error(e);
      setErr("Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page" style={{ display: "grid", placeItems: "center" }}>
      <section style={{ width: "100%", maxWidth: 520 }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, margin: 0 }}>Buyer Login</h1>
          <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.7 }}>
            Sign in to purchase and download watermark-free files. Your downloads will appear in your dashboard.
          </p>

          <button
            type="button"
            onClick={onLogin}
            disabled={busy}
            style={{
              marginTop: 14,
              width: "100%",
              border: "none",
              borderRadius: 999,
              padding: "12px 16px",
              cursor: busy ? "not-allowed" : "pointer",
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
              boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
              opacity: busy ? 0.75 : 1,
            }}
          >
            {busy ? "Signing in…" : "Continue with Google"}
          </button>

          {err && (
            <div
              style={{
                marginTop: 12,
                borderRadius: 14,
                padding: 12,
                border: "1px solid rgba(248,113,113,0.35)",
                background: "rgba(254,226,226,0.65)",
                color: "#7f1d1d",
              }}
            >
              {err}
            </div>
          )}

          <div style={{ marginTop: 14, color: "#64748b", fontSize: "0.92rem", lineHeight: 1.6 }}>
            Tip: If you clicked “Buy” from Explore, you’ll return automatically after login.
          </div>
        </div>
      </section>
    </main>
  );
}
