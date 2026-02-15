import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-6">Loading...</div>;

  // Not logged in → go to correct login page
  if (!user) {
    const loginPath = requireRole === "seller" ? "/seller-login" : "/buyer-login";
    return <Navigate to={`${loginPath}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Logged in but wrong role → redirect to correct dashboard
  if (requireRole && role && role !== requireRole) {
    return <Navigate to={role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"} replace />;
  }

  return children;
}
