// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ role }) => {
  const { user, role: userRole, loading } = useAuth();

  if (loading) {
    return null; // or a spinner if you want
  }

  if (!user) {
    return <Navigate to="/buyer-login" replace />;
  }

  if (role && userRole !== role) {
    // logged in but wrong type (buyer vs seller)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
