import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ requireRole }) {
  const { user, role, loading } = useAuth();

  // While we’re checking Firebase, render nothing (or a small spinner if you want)
  if (loading) return null;

  if (!user) {
    const to = requireRole === 'seller' ? '/seller/login' : '/buyer/login';
    return <Navigate to={to} replace />;
  }

  if (requireRole && role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
