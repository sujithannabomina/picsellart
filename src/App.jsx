import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Refund from './pages/Refund'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import SellerLogin from './pages/SellerLogin'
import BuyerLogin from './pages/BuyerLogin'
import SellerOnboarding from './pages/SellerOnboarding'
import SellerStart from './pages/SellerStart'
import SellerSubscribe from './pages/SellerSubscribe'
import SellerDashboard from './pages/SellerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import PhotoDetails from './pages/PhotoDetails'
import { RequireAuth, RequireSellerActive } from './routes/guards'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/photo/:id" element={<PhotoDetails />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/contact" element={<Contact />} />

          {/* Buyer */}
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route
            path="/buyer/dashboard"
            element={
              <RequireAuth to="/buyer/login">
                <BuyerDashboard />
              </RequireAuth>
            }
          />

          {/* Seller */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/onboarding" element={<SellerOnboarding />} />
          <Route
            path="/seller/start"
            element={
              <RequireAuth to="/seller/login">
                <SellerStart />
              </RequireAuth>
            }
          />
          <Route
            path="/seller/subscribe"
            element={
              <RequireAuth to="/seller/login">
                <SellerSubscribe />
              </RequireAuth>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <RequireSellerActive>
                <SellerDashboard />
              </RequireSellerActive>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
