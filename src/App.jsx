// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import Faq from './pages/Faq';
import Refund from './pages/Refund';
import Contact from './pages/Contact';

import BuyerLogin from './pages/BuyerLogin';
import SellerLogin from './pages/SellerLogin';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/buyer/login" element={<BuyerLogin />} />
              <Route path="/seller/login" element={<SellerLogin />} />

              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allow="buyer" redirectTo="/buyer/login">
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute allow="seller" redirectTo="/seller/login">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* keep your other routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
