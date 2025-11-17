// src/pages/BuyerLogin.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BuyerLogin = () => {
  const { user, isBuyer, loginAsBuyer } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state && location.state.redirectTo) || "/buyer-dashboard";

  useEffect(() => {
    if (user && isBuyer) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, isBuyer, navigate, redirectTo]);

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      await loginAsBuyer();
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
        <h1 className="page-title">Buyer Login</h1>
        <p className="page-subtitle">
          Sign in with Google to purchase, download, and manage your images.
        </p>

        <button
          className="btn-primary wide"
          disabled={submitting}
          onClick={handleLogin}
        >
          {submitting ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="auth-hint">
          After login you’ll be redirected to your downloads dashboard.
        </p>
      </section>
    </main>
  );
};

export default BuyerLogin;
