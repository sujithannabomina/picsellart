import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import Faq from './pages/Faq';
import Refund from './pages/Refund';
import Contact from './pages/Contact';

import BuyerLogin from './pages/BuyerLogin';
import SellerLogin from './pages/SellerLogin';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import SellerOnboarding from './pages/SellerOnboarding';
import PhotoDetails from './pages/PhotoDetails';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/photo/:id" element={<PhotoDetails />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/contact" element={<Contact />} />

          {/* auth */}
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/seller/login" element={<SellerLogin />} />

          {/* dashboards */}
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/onboarding" element={<SellerOnboarding />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
