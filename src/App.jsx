import { Routes, Route } from 'react-router-dom'
import Page from './components/Page'

// pages
import LandingPage from './pages/LandingPage'
import Explore from './pages/Explore'
import Faq from './pages/Faq'
import Refund from './pages/Refund'
import Contact from './pages/Contact'
import BuyerLogin from './pages/BuyerLogin'
import SellerLogin from './pages/SellerLogin'
import BuyerDashboard from './pages/BuyerDashboard'
import SellerDashboard from './pages/SellerDashboard'
import SellerOnboarding from './pages/SellerOnboarding'
import SellerStart from './pages/SellerStart'
import SellerSubscribe from './pages/SellerSubscribe'
import PhotoDetails from './pages/PhotoDetails'

export default function App() {
  return (
    <Page>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/photo/:id" element={<PhotoDetails />} />

        {/* Buyer */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

        {/* Seller */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/start" element={<SellerStart />} />
        <Route path="/seller/subscribe" element={<SellerSubscribe />} />
        <Route path="/seller/onboarding" element={<SellerOnboarding />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />

        {/* Static */}
        <Route path="/faq" element={<Faq />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Page>
  )
}
