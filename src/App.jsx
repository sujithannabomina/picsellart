import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

import LandingPage from './pages/LandingPage.jsx'
import Explore from './pages/Explore.jsx'
import PhotoDetails from './pages/PhotoDetails.jsx'

import BuyerLogin from './pages/BuyerLogin.jsx'
import BuyerDashboard from './pages/BuyerDashboard.jsx'

import SellerStart from './pages/SellerStart.jsx'
import SellerLogin from './pages/SellerLogin.jsx'
import SellerOnboarding from './pages/SellerOnboarding.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'

import Faq from './pages/Faq.jsx'
import Refund from './pages/Refund.jsx'
import Contact from './pages/Contact.jsx'
import License from './pages/License.jsx'

function RequireAuth({ children, role }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) {
    return (
      <Navigate
        to={role === 'seller' ? '/seller/login' : '/buyer/login'}
        state={{ from: location }}
        replace
      />
    )
  }
  if (role && profile?.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/photo/:photoId" element={<PhotoDetails />} />

        {/* Buyer flow */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route
          path="/buyer/dashboard"
          element={
            <RequireAuth role="buyer">
              <BuyerDashboard />
            </RequireAuth>
          }
        />

        {/* Seller flow */}
        <Route path="/seller" element={<Navigate to="/seller/start" replace />} />
        <Route path="/seller/start" element={<SellerStart />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route
          path="/seller/onboarding"
          element={
            <RequireAuth role="seller">
              <SellerOnboarding />
            </RequireAuth>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <RequireAuth role="seller">
              <SellerDashboard />
            </RequireAuth>
          }
        />

        {/* License */}
        <Route
          path="/license/:orderId"
          element={
            <RequireAuth role="buyer">
              <License />
            </RequireAuth>
          }
        />

        {/* Static/support */}
        <Route path="/faq" element={<Faq />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/contact" element={<Contact />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
