// src/pages/SellerLogin.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ensureSellerProfile } from "../utils/seller";

const SellerLogin = () => {
  const { user, role, loginAsSeller } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const go = async () => {
      if (user && role === "seller") {
        await ensureSellerProfile(user.uid, user.email);
        navigate("/seller-dashboard", { replace: true });
      }
    };
    go();
  }, [user, role, navigate]);

  const handleLogin = async () => {
    try {
      await loginAsSeller();
      if (user) {
        await ensureSellerProfile(user.uid, user.email);
      }
      navigate("/seller-dashboard", { replace: true });
    } catch (err) {
      console.error("Seller login failed", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <main className="page-wrapper">
      <div className="page-inner auth-page">
        <h1 className="page-title">Seller Login</h1>
        <p className="page-subtitle">
          Sign in with Google to manage your plans, uploads and earnings.
        </p>
        <button className="pill-button primary" onClick={handleLogin}>
          Continue with Google
        </button>
      </div>
    </main>
  );
};

export default SellerLogin;
