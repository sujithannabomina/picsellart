// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function RequireAuth({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <main className="page">
        <section style={{ maxWidth: 980, margin: "0 auto", paddingTop: 24 }}>
          <p>Loading…</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/buyer-login" state={{ from: location }} replace />;
  }

  return children;
}
