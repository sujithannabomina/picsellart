// src/pages/BuyerLogin.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BuyerLogin = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const redirectTo = useMemo(() => {
    const r = searchParams.get("redirect");
    return r ? decodeURIComponent(r) : "/buyer/dashboard";
  }, [searchParams]);

  const onLogin = async () => {
    setError("");
    const res = await loginWithGoogle("buyer");
    if (!res.ok) {
      setError(res.error || "Login failed. Please try again.");
      return;
    }
    navigate(redirectTo);
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Buyer Login</h1>
        <p style={{ color: "#4b5563" }}>
          Login to purchase and download watermark-free files. Your buyer dashboard will show your activity.
        </p>

        <button className="btn btn-nav-primary" onClick={onLogin} style={{ marginTop: 14 }}>
          Continue with Google
        </button>

        {error ? <p style={{ marginTop: 10, color: "#dc2626", fontWeight: 700 }}>{error}</p> : null}

        <p style={{ marginTop: 10, color: "#6b7280", fontSize: "0.9rem" }}>
          Security note: Picsellart will never ask your password/OTP via email or chat.
        </p>
      </div>
    </div>
  );
};

export default BuyerLogin;
