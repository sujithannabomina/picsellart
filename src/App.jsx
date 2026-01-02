// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";

import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";

import ViewPhoto from "./pages/ViewPhoto";
import Checkout from "./pages/Checkout";

import SellerUpload from "./pages/SellerUpload";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />

        {/* ✅ FAQ fixed: Faq.jsx */}
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refunds" element={<Refunds />} />

        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/seller-login" element={<SellerLogin />} />

        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/upload" element={<SellerUpload />} />

        {/* ✅ View & checkout */}
        <Route path="/photo/:id" element={<ViewPhoto />} />
        <Route path="/checkout/:id" element={<Checkout />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
