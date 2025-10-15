import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import Header from "./components/Header";

import LandingPage from "./pages/LandingPage";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";
import Refund from "./pages/Refund";
import Contact from "./pages/Contact";

import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerRenew from "./pages/SellerRenew"; // NEW

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/renew" element={<SellerRenew />} />   {/* NEW */}

          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
