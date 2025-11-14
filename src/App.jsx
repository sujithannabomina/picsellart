// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Refunds from "./pages/Refunds";
import NotFound from "./pages/NotFound";

// Auth pages
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";

// Dashboards
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";

const App = () => {
  return (
    <Layout>
      <Routes>
        {/* Landing / marketing */}
        <Route path="/" element={<LandingPage />} />

        {/* Explore gallery */}
        <Route path="/explore" element={<Explore />} />

        {/* Auth entry points */}
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/seller-login" element={<SellerLogin />} />

        {/* Buyer area – must be logged in as buyer */}
        <Route
          path="/buyer-dashboard"
          element={
            <ProtectedRoute role="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Seller area – must be logged in as seller */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Static info pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/refunds" element={<Refunds />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
