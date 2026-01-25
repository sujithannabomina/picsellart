import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";

import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";

import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOnboarding from "./pages/SellerOnboarding";
import SellerUpload from "./pages/SellerUpload";

import Checkout from "./pages/Checkout";
import ViewPhoto from "./pages/ViewPhoto";
import ViewImage from "./pages/ViewImage";

import NotFound from "./pages/NotFound";

import BuyerRoute from "./routes/BuyerRoute";
import SellerRoute from "./routes/SellerRoute";

export default function App() {
  return (
    <Routes>
      {/* ✅ All pages get Header/Footer via Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* Main pages */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refunds" element={<Refunds />} />

        {/* ✅ Login routes (fix 404) */}
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/seller-login" element={<SellerLogin />} />

        {/* Legacy aliases (so old links won't break) */}
        <Route path="/buyer/login" element={<Navigate to="/buyer-login" replace />} />
        <Route path="/seller/login" element={<Navigate to="/seller-login" replace />} />

        {/* ✅ View routes (fix View button + /photo/sample1.jpg) */}
        <Route path="/view/:id" element={<ViewPhoto />} />
        <Route path="/photo/:name" element={<ViewImage />} />

        {/* ✅ Checkout route (fix Buy 404) */}
        <Route path="/checkout" element={<Checkout />} />

        {/* ✅ Dashboards (fix 404 + protect) */}
        <Route
          path="/buyer-dashboard"
          element={
            <BuyerRoute>
              <BuyerDashboard />
            </BuyerRoute>
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            <SellerRoute>
              <SellerDashboard />
            </SellerRoute>
          }
        />

        {/* Legacy dashboard aliases */}
        <Route path="/buyer/dashboard" element={<Navigate to="/buyer-dashboard" replace />} />
        <Route path="/seller/dashboard" element={<Navigate to="/seller-dashboard" replace />} />

        {/* Seller flow */}
        <Route path="/seller-onboarding" element={<SellerOnboarding />} />
        <Route path="/seller/onboarding" element={<Navigate to="/seller-onboarding" replace />} />

        <Route
          path="/seller-upload"
          element={
            <SellerRoute>
              <SellerUpload />
            </SellerRoute>
          }
        />
        <Route path="/seller/upload" element={<Navigate to="/seller-upload" replace />} />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
