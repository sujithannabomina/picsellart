import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RequireAuth({ role = "buyer", children }) {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate(role === "seller" ? "/seller-login" : "/buyer-login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    // If role mismatch, send to correct dashboard/login
    const actualRole = (profile?.role || "buyer").toLowerCase();
    if (role === "seller" && actualRole !== "seller") {
      navigate("/buyer/dashboard", { replace: true });
    }
    if (role === "buyer" && actualRole !== "buyer") {
      navigate("/seller/dashboard", { replace: true });
    }
  }, [user, loading, profile, navigate, location.pathname, role]);

  if (loading) return null;
  if (!user) return null;

  return children;
}
