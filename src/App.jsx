// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import LandingPage from "./pages/LandingPage";
import Explore from "./pages/Explore";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Refunds from "./pages/Refunds";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home / Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Public gallery */}
          <Route path="/explore" element={<Explore />} />

          {/* Buyer auth & dashboard */}
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />

          {/* Seller auth & dashboard */}
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />

          {/* Static pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/refunds" element={<Refunds />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
