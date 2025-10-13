import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import LandingPage from './pages/LandingPage'
import Explore from './pages/Explore'
import Faq from './pages/Faq'
import Refund from './pages/Refund'
import Contact from './pages/Contact'
import License from './pages/License'
import BuyerLogin from './pages/BuyerLogin'
import SellerLogin from './pages/SellerLogin'
import BuyerDashboard from './pages/BuyerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import SellerStart from './pages/SellerStart'
import SellerOnboarding from './pages/SellerOnboarding'
import SellerSubscribe from './pages/SellerSubscribe'
import PhotoDetails from './pages/PhotoDetails'
import Settings from './pages/Settings'

function Protected({ children, allow }) {
  const { loading, user, role } = useAuth()
  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading…</div>
  if (!user) return <Navigate to="/" replace />
  if (allow && allow !== role) return <Navigate to="/" replace />
  return children
}

function Shell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/photo/:id" element={<PhotoDetails />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/license" element={<License />} />

          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/seller/login" element={<SellerLogin />} />

          <Route path="/buyer/dashboard" element={
            <Protected allow="buyer"><BuyerDashboard /></Protected>
          } />
          <Route path="/seller/dashboard" element={
            <Protected allow="seller"><SellerDashboard /></Protected>
          } />

          <Route path="/seller/start" element={<SellerStart />} />
          <Route path="/seller/onboarding" element={<SellerOnboarding />} />
          <Route path="/seller/subscribe" element={<SellerSubscribe />} />

          <Route path="/settings" element={
            <Protected><Settings /></Protected>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  )
}
