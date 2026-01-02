// src/pages/BuyerLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerLogin() {
  const navigate = useNavigate();
  const { loginWithGoogleAs } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogin() {
    setErr("");
    setLoading(true);
    try {
      await loginWithGoogleAs("buyer");

      const returnTo = sessionStorage.getItem("psa:returnTo");
      if (returnTo) {
        sessionStorage.removeItem("psa:returnTo");
        navigate(returnTo);
      } else {
        navigate("/buyer/dashboard");
      }
    } catch (e) {
      console.error(e);
      setErr("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="auth">
        <h1>Buyer Login</h1>
        <p className="muted">Login to purchase and download watermark-free files. Your buyer dashboard will show your activity.</p>

        <div className="auth-card">
          <button className="btn btn-primary" disabled={loading} onClick={handleLogin}>
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          {err ? <div className="auth-error">{err}</div> : null}

          <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>
            Security note: Picsellart will never ask your password/OTP via email or chat.
          </div>
        </div>
      </section>
    </main>
  );
}
