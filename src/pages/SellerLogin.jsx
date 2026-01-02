// src/pages/SellerLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SellerLogin() {
  const navigate = useNavigate();
  const { loginWithGoogleAs } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogin() {
    setErr("");
    setLoading(true);
    try {
      await loginWithGoogleAs("seller");
      navigate("/seller/dashboard");
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
        <h1>Seller Login</h1>
        <p className="muted">Login to manage your plan, upload images within limits, and track your sales.</p>

        <div className="auth-card">
          <button className="btn btn-primary" disabled={loading} onClick={handleLogin}>
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          {err ? <div className="auth-error">{err}</div> : null}
        </div>
      </section>
    </main>
  );
}
