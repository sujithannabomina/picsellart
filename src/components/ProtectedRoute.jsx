import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, role: required }) {
  const { user, role, loading } = useAuth()
  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <Navigate to={required === 'seller' ? '/seller/login' : '/buyer/login'} replace />
  if (required && role !== required) return <Navigate to="/" replace />
  return children
}
