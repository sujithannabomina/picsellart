import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

/**
 * Usage:
 * <ProtectedRoute requireRole="seller">...</ProtectedRoute>
 * <ProtectedRoute requireRole="buyer">...</ProtectedRoute>
 */
export default function ProtectedRoute({ children, requireRole }) {
  const { user, profile, loading, isSellerExpired } = useAuth();
  const { pathname } = useLocation();

  if (loading) return null;

  // Not logged in → send to correct login page
  if (!user) {
    const to = requireRole === "seller" ? "/seller/login" : "/buyer/login";
    return <Navigate to={to} replace state={{ from: pathname }} />;
  }

  // If wrong role, send them to their own dashboard (or login)
  if (requireRole && profile?.role !== requireRole) {
    const to = profile?.role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";
    return <Navigate to={to} replace />;
  }

  // Seller gating: if expired, block all seller pages except renew
  if (requireRole === "seller" && isSellerExpired) {
    // Allow only renewal path
    if (pathname !== "/seller/renew") {
      return <Navigate to="/seller/renew" replace />;
    }
  }

  return children;
}
