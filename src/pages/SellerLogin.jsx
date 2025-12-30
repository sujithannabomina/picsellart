// src/pages/SellerLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SellerLogin = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");

  const onLogin = async () => {
    setError("");
    const res = await loginWithGoogle("seller");
    if (!res.ok) {
      setError(res.error || "Login failed. Please try again.");
      return;
    }
    navigate("/seller/dashboard");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Seller Login</h1>
        <p style={{ color: "#4b5563" }}>
          Login to manage your plan, upload images within limits, and track your sales.
        </p>

        <button className="btn btn-nav-primary" onClick={onLogin} style={{ marginTop: 14 }}>
          Continue with Google
        </button>

        {error ? (
          <p style={{ marginTop: 10, color: "#dc2626", fontWeight: 600 }}>{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default SellerLogin;
