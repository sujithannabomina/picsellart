import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to={`/${requireRole}/login`} replace />;
  if (requireRole && profile?.role !== requireRole) {
    return <Navigate to={`/${profile?.role || "buyer"}/dashboard`} replace />;
  }
  return children;
}
