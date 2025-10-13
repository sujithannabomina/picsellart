import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireRole }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading…</div>;
  }

  if (!user) {
    // not signed in
    if (requireRole === 'seller') return <Navigate to="/seller/login" replace />;
    if (requireRole === 'buyer')  return <Navigate to="/buyer/login" replace />;
    return <Navigate to="/buyer/login" replace />;
  }

  if (requireRole && role && role !== requireRole) {
    // signed in but wrong role -> send them to their own dashboard
    return role === 'seller'
      ? <Navigate to="/seller/dashboard" replace />
      : <Navigate to="/buyer/dashboard" replace />;
  }

  return children;
}
