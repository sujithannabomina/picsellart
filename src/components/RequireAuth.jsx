// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RequireAuth({ role, children }) {
  const { user, loading, isBuyer, isSeller } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page" style={{ display: "grid", placeItems: "center", minHeight: "70vh" }}>
        <div style={{ color: "#4b5563" }}>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={role === "seller" ? "/seller-login" : "/buyer-login"} state={{ from: location }} replace />;
  }

  if (role === "buyer" && !isBuyer) return <Navigate to="/buyer-login" replace />;
  if (role === "seller" && !isSeller) return <Navigate to="/seller-login" replace />;

  return children;
}
