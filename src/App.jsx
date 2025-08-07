import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import RefundPolicy from "./pages/RefundPolicy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/refund" element={<RefundPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
