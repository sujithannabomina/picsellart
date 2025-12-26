// src/pages/BuyerLogin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function BuyerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, initializing, authError, setAuthError, loginWithGoogle } = useAuth();

  const [busy, setBusy] = useState(false);

  // If user becomes logged in, go to buyer dashboard
  useEffect(() => {
    if (!initializing && user) {
      const redirectTo =
        location.state?.from?.pathname ||
        location.state?.redirectTo ||
        "/buyer/dashboard";
      navigate(redirectTo, { replace: true });
    }
  }, [user, initializing, navigate, location.state]);

  async function handleGoogle() {
    setAuthError("");
    setBusy(true);
    try {
      const res = await loginWithGoogle();
      // If redirect is triggered, page navigates away automatically.
      if (!res?.ok) {
        // error already stored in authError
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <section style={{ maxWidth: 980, margin: "0 auto", paddingTop: 24 }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 6 }}>Buyer Login</h1>
        <p style={{ color: "#4b5563", marginTop: 0 }}>
          Login to purchase and download watermark-free files. Your buyer dashboard will show your activity.
        </p>

        <div
          style={{
            marginTop: 18,
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
            padding: 18,
          }}
        >
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy || initializing}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "10px 16px",
              cursor: busy ? "not-allowed" : "pointer",
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
              boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
              opacity: busy ? 0.85 : 1,
            }}
          >
            {busy ? "Signing in..." : "Continue with Google"}
          </button>

          {authError ? (
            <p style={{ marginTop: 12, color: "#b91c1c", fontWeight: 600 }}>
              {authError}
            </p>
          ) : null}

          <p style={{ marginTop: 12, color: "#64748b" }}>
            Security note: Picsellart will never ask your password/OTP via email or chat.
          </p>
        </div>
      </section>
    </main>
  );
}
