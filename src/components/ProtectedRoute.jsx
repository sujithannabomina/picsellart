import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, mustBeSeller = false, mustHavePlan = false }) {
  const { user, role, sellerHasActivePlan, loading } = useAuth();

  if (loading) return null; // or a small inline loader

  if (!user) return <Navigate to={mustBeSeller ? "/seller" : "/buyer"} replace />;
  if (mustBeSeller && role !== "seller") return <Navigate to="/seller" replace />;
  if (mustBeSeller && mustHavePlan && !sellerHasActivePlan) return <Navigate to="/seller/subscribe" replace />;

  return children;
}
