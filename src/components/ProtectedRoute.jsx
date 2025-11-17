// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Usage:
 * <ProtectedRoute role="buyer">
 *   <BuyerDashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, role: currentRole, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading...</div>;

  if (!user) {
    return (
      <Navigate
        to={role === "seller" ? "/seller-login" : "/buyer-login"}
        replace
      />
    );
  }

  if (role && currentRole && currentRole !== role) {
    // Logged in as different role – send home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
