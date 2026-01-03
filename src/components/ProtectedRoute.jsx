import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={role === "seller" ? `/seller-login?next=${next}` : `/buyer-login?next=${next}`} replace />;
  }

  if (role === "buyer" && !roles.buyer) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/buyer-login?next=${next}`} replace />;
  }

  if (role === "seller" && !roles.seller) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/seller-login?next=${next}`} replace />;
  }

  return children;
}
