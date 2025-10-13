import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children, to = '/buyer/login' }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to={to} replace state={{ from: loc }} />
  return children
}

export function RequireSellerActive({ children }) {
  const { user, role, sellerActive, loading } = useAuth()
  const loc = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/seller/login" replace state={{ from: loc }} />
  if (role !== 'seller') return <Navigate to="/seller/onboarding" replace />
  if (!sellerActive) return <Navigate to="/seller/start" replace />
  return children
}
