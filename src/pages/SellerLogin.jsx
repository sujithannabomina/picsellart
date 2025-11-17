// src/pages/SellerLogin.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SellerLogin = () => {
  const { user, isSeller, loginAsSeller } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state && location.state.redirectTo) || "/seller-dashboard";

  useEffect(() => {
    if (user && isSeller) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, isSeller, navigate, redirectTo]);

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      await loginAsSeller();
      navigate(redirectTo, { replace: true });
    } catch {
      alert("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="auth-card">
        <h1 className="page-title">Seller Login</h1>
        <p className="page-subtitle">
          Sign in with Google to manage your plans, uploads and earnings.
        </p>

        <button
          className="btn-primary wide"
          disabled={submitting}
          onClick={handleLogin}
        >
          {submitting ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="auth-hint">
          New seller? After login you can choose a plan and start uploading.
        </p>
      </section>
    </main>
  );
};

export default SellerLogin;
