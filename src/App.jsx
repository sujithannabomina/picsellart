import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Page from './components/Page'

// Your existing visual pages – keep them as they are
import LandingPage from './pages/LandingPage'
import Explore from './pages/Explore'
import Faq from './pages/Faq'
import Refund from './pages/Refund'
import Contact from './pages/Contact'

// New/updated auth pages
import BuyerLogin from './pages/BuyerLogin'
import SellerLogin from './pages/SellerLogin'
import BuyerDashboard from './pages/BuyerDashboard'
import SellerDashboard from './pages/SellerDashboard'

// Optional seller funnel pages if you already have them
import SellerStart from './pages/SellerStart'
import SellerSubscribe from './pages/SellerSubscribe'
import SellerOnboarding from './pages/SellerOnboarding'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Page>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth */}
            <Route path="/buyer/login" element={<BuyerLogin />} />
            <Route path="/seller/login" element={<SellerLogin />} />

            {/* Dashboards */}
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />

            {/* Seller funnel (if present in your repo) */}
            <Route path="/seller/start" element={<SellerStart />} />
            <Route path="/seller/subscribe" element={<SellerSubscribe />} />
            <Route path="/seller/onboarding" element={<SellerOnboarding />} />

            {/* Fallback to home */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Page>
      </AuthProvider>
    </BrowserRouter>
  )
}
