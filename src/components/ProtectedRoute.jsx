// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allow, redirectTo = '/' }) {
  const { initializing, user, role } = useAuth();

  if (initializing) return <div className="max-w-6xl mx-auto p-8">Loading…</div>;
  if (!user) return <Navigate to={redirectTo} replace />;

  if (allow && allow !== role) {
    // wrong role -> bounce to their own dashboard (or home)
    return <Navigate to={role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard'} replace />;
  }

  return children;
}
