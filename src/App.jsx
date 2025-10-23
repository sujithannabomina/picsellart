import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// layout & shared
import Header from "./components/Header.jsx";

// pages
import LandingPage from "./pages/LandingPage.jsx";
import Explore from "./pages/Explore.jsx";
import Faq from "./pages/Faq.jsx";
import Refund from "./pages/Refund.jsx";
import Contact from "./pages/Contact.jsx";

import BuyerLogin from "./pages/BuyerLogin.jsx";
import SellerLogin from "./pages/SellerLogin.jsx";

import SellerPlan from "./pages/SellerPlan.jsx";
import SellerRenew from "./pages/SellerRenew.jsx";

import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";

import PhotoDetails from "./pages/PhotoDetails.jsx";

// If you have an Auth context, keep using it.
// import { AuthProvider } from "./context/AuthContext";  // example

export default function App() {
  return (
    // <AuthProvider>  {/* Uncomment if you’re using this already */}
    <>
      <Header />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/seller/login" element={<SellerLogin />} />

        <Route path="/seller/plan" element={<SellerPlan />} />
        <Route path="/seller/renew" element={<SellerRenew />} />

        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />

        <Route path="/photo/:id" element={<PhotoDetails />} />

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
    // </AuthProvider>
  );
}
