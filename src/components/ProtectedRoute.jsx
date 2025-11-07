// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const loc = useLocation();

  if (!ready) return <main className="p-6">Loading…</main>;
  if (!user) {
    // If the path contains "seller" → send to /seller; else to /buyer.
    const loginPath = loc.pathname.includes("/seller") ? "/seller" : "/buyer";
    return <Navigate to={loginPath} replace />;
  }
  return children;
}
