// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RequireAuth({ allowRole, children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth || auth.loading) {
    return (
      <div className="page">
        <section>
          <p style={{ padding: 20 }}>Loading…</p>
        </section>
      </div>
    );
  }

  if (!auth.user) {
    const target = allowRole === "seller" ? "/seller-login" : "/buyer-login";
    return <Navigate to={`${target}?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowRole && auth.role !== allowRole) {
    // logged in, but wrong role
    const target = auth.role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";
    return <Navigate to={target} replace />;
  }

  return children;
}
