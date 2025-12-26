import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ padding: "28px 16px", maxWidth: 1120, margin: "0 auto" }}>
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/buyer-login" replace />;
  return children;
}
