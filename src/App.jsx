// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import PhotoDetails from './pages/PhotoDetails';
import Refund from './pages/Refund';
import Contact from './pages/Contact';
import Faq from './pages/Faq';

import SellerLogin from './pages/SellerLogin';
import SellerStart from './pages/SellerStart';
import SellerOnboarding from './pages/SellerOnboarding';
import SellerSubscribe from './pages/SellerSubscribe';
import SellerDashboard from './pages/SellerDashboard';

import BuyerLogin from './pages/BuyerLogin';
import BuyerDashboard from './pages/BuyerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/photo/:id" element={<PhotoDetails />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/contact" element={<Contact />} />

        {/* buyer auth + dashboard */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

        {/* seller onboarding flow */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/start" element={<SellerStart />} />
        <Route path="/seller/onboarding" element={<SellerOnboarding />} />
        <Route path="/seller/subscribe" element={<SellerSubscribe />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
