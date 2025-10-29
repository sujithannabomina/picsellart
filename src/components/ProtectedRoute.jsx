import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ need, children }) {
  const { user, role, loading } = useAuth();
  if (loading) return null; // or skeleton
  if (!user) return <Navigate to="/" replace />;
  if (need && role !== need) return <Navigate to="/" replace />;
  return children;
}
