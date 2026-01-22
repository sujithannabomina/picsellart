// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Faq from "./pages/Faq.jsx";
import Contact from "./pages/Contact.jsx";
import Refunds from "./pages/Refunds.jsx";
import NotFound from "./pages/NotFound.jsx";

import SellerLogin from "./pages/SellerLogin.jsx";
import SellerOnboarding from "./pages/SellerOnboarding.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import SellerUpload from "./pages/SellerUpload.jsx";

import BuyerLogin from "./pages/BuyerLogin.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";

import SellerRoute from "./routes/SellerRoute.jsx";
import BuyerRoute from "./routes/BuyerRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refunds" element={<Refunds />} />

      {/* Seller */}
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/seller/onboarding" element={<SellerOnboarding />} />
      <Route
        path="/seller/dashboard"
        element={
          <SellerRoute>
            <SellerDashboard />
          </SellerRoute>
        }
      />
      <Route
        path="/seller/upload"
        element={
          <SellerRoute>
            <SellerUpload />
          </SellerRoute>
        }
      />

      {/* Buyer */}
      <Route path="/buyer/login" element={<BuyerLogin />} />
      <Route
        path="/buyer/dashboard"
        element={
          <BuyerRoute>
            <BuyerDashboard />
          </BuyerRoute>
        }
      />

      {/* Fallback */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
