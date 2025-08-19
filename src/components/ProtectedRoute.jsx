import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function ProtectedRoute({ children, role }) {
const { user, profile, loading } = useAuth()
const location = useLocation()
if (loading) return null
if (!user) return <Navigate to={role === 'seller' ? '/seller/login' : '/buyer/login'} state={{ from: location }} replace />
if (role && profile?.role !== role) return <Navigate to="/" replace />
return children
}