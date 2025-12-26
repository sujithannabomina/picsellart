import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loginWithGoogle, setRoleHint } = useAuth();

  const [error, setError] = useState("");

  useEffect(() => {
    setRoleHint("buyer");
  }, [setRoleHint]);

  useEffect(() => {
    // If already logged in and buyer, go dashboard
    if (user && (profile?.role || "buyer") === "buyer") {
      navigate("/buyer/dashboard", { replace: true });
    }
  }, [user, profile, navigate]);

  const onLogin = async () => {
    setError("");
    const res = await loginWithGoogle();

    if (!res.ok) {
      const code = res?.error?.code || "unknown";
      const msg =
        res?.error?.message ||
        "Login failed. Please try again.";

      setError(`Login failed (${code}). ${msg}`);
      return;
    }

    // If redirect, browser will navigate away automatically.
    // If popup success, route now:
    const from = location.state?.from;
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate("/buyer/dashboard", { replace: true });
    }
  };

  const pageStyle = { maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" };

  const cardStyle = {
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
    padding: 18,
    maxWidth: 860,
    marginTop: 14,
  };

  const btn = {
    border: "none",
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
    color: "white",
    background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
    boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
  };

  return (
    <main className="page">
      <section style={pageStyle}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Buyer Login</h1>
        <p style={{ marginTop: 10, color: "#4b5563", lineHeight: 1.65, maxWidth: 860 }}>
          Login to purchase and download watermark-free files. Your buyer dashboard will show your activity.
        </p>

        <div style={cardStyle}>
          <button type="button" style={btn} onClick={onLogin}>
            Continue with Google
          </button>

          {error && (
            <div style={{ marginTop: 12, color: "#b91c1c", fontWeight: 700 }}>
              {error}
            </div>
          )}

          <p style={{ marginTop: 10, color: "#64748b" }}>
            Security note: Picsellart will never ask your password/OTP via email or chat.
          </p>
        </div>
      </section>
    </main>
  );
}
