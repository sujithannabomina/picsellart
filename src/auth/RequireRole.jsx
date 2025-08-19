import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireRole({ role, children }) {
  const { user, role: currentRole, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (currentRole !== role) {
    // send sellers to seller-login, buyers to buyer-login
    return <Navigate to={role === "seller" ? "/seller-login" : "/buyer-login"} replace />;
  }
  return children;
}
