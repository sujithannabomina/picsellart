// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="page"><div className="card">Loading...</div></div>;

  if (!user) {
    // redirect to correct login page
    return <Navigate to={requiredRole === "seller" ? "/seller-login" : "/buyer-login"} replace />;
  }

  if (requiredRole && role && role !== requiredRole) {
    // logged in but wrong role
    return <Navigate to={role === "seller" ? "/seller/dashboard" : "/buyer/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
