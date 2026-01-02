// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Your pages (match your exact filenames)
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";
import NotFound from "./pages/NotFound";

import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";

import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerUpload from "./pages/SellerUpload";

// We will reuse your existing page for View
import ViewPhoto from "./pages/ViewPhoto";

// NEW page file we add for Buy flow
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refunds" element={<Refunds />} />

        {/* Login pages */}
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/seller-login" element={<SellerLogin />} />

        {/* View + Checkout */}
        <Route path="/photo/:id" element={<ViewPhoto />} />
        <Route path="/checkout/:id" element={<Checkout />} />

        {/* Dashboards */}
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute requiredRole="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/upload"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerUpload />
            </ProtectedRoute>
          }
        />

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
