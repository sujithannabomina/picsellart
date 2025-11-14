// src/pages/BuyerLogin.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BuyerLogin = () => {
  const { user, role, loginAsBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state && location.state.redirectTo) || "/buyer-dashboard";

  useEffect(() => {
    if (user && role === "buyer") {
      navigate(redirectTo, { replace: true });
    }
  }, [user, role, navigate, redirectTo]);

  const handleLogin = async () => {
    try {
      await loginAsBuyer();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Buyer login failed", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <main className="page-wrapper">
      <div className="page-inner auth-page">
        <h1 className="page-title">Buyer Login</h1>
        <p className="page-subtitle">
          Sign in with Google to purchase and download photos. Your purchases
          will be stored in your buyer dashboard.
        </p>
        <button className="pill-button primary" onClick={handleLogin}>
          Continue with Google
        </button>
      </div>
    </main>
  );
};

export default BuyerLogin;
