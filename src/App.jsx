import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Explore from './pages/Explore.jsx'
import PhotoDetail from './pages/PhotoDetail.jsx'
import BuyerLogin from './pages/BuyerLogin.jsx'
import SellerLogin from './pages/SellerLogin.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import SellerSubscribe from './pages/SellerSubscribe.jsx'
import FAQ from './pages/FAQ.jsx'
import Contact from './pages/Contact.jsx'
import Refunds from './pages/Refunds.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/photo/:id" element={<PhotoDetail />} />
        <Route path="/buyer" element={<BuyerLogin />} />
        <Route path="/seller" element={<SellerLogin />} />
        <Route path="/seller/subscribe" element={<SellerSubscribe />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refunds" element={<Refunds />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
