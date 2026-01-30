// FILE PATH: src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage"; // ✅ untouched
import Explore from "./pages/Explore";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import Checkout from "./pages/Checkout";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";

import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";

import SellerOnboarding from "./pages/SellerOnboarding";
import SellerUpload from "./pages/SellerUpload";

import ViewPhoto from "./pages/ViewPhoto";
import ViewImage from "./pages/ViewImage";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Main */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Public pages */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refunds" element={<Refunds />} />

        {/* ✅ Logins (both spellings supported to stop 404) */}
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/buyer/login" element={<Navigate to="/buyer-login" replace />} />

        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/seller/login" element={<Navigate to="/seller-login" replace />} />

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Seller onboarding + upload */}
        <Route path="/seller-onboarding" element={<SellerOnboarding />} />
        <Route path="/seller/upload" element={<SellerUpload />} />

        {/* Dashboards (aliases supported) */}
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/dashboard" element={<Navigate to="/buyer-dashboard" replace />} />

        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller/dashboard" element={<Navigate to="/seller-dashboard" replace />} />

        {/* ✅ Photo view routes (View button will work + refresh/back won’t break) */}
        <Route path="/photo/:id" element={<ViewPhoto />} />
        <Route path="/view/:id" element={<ViewImage />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
