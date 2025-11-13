import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireBuyer({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (role !== "buyer") return <Navigate to="/buyer-dashboard" replace />;
  return children;
}

export function RequireSeller({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (role !== "seller") return <Navigate to="/seller-gateway" replace />;
  return children;
}
