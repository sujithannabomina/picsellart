// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, role: currentRole, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  if (!user) {
    // Not logged in
    return <Navigate to={role === "seller" ? "/seller-login" : "/buyer-login"} />;
  }

  if (role && currentRole && role !== currentRole) {
    // Logged in as wrong role
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
