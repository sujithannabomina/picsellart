// FILE: src/components/RoleRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ role, children }) {
  const { user, loading, activeRole } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to={role === "seller" ? "/seller-login" : "/buyer-login"} replace />;
  }

  // must match active role
  if (activeRole !== role) {
    return <Navigate to={role === "seller" ? "/seller-login" : "/buyer-login"} replace />;
  }

  return children;
}
