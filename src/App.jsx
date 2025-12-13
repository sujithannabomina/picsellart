// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ViewPhoto from "./pages/ViewPhoto";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";

import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";

import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/view/:id" element={<ViewPhoto />} />

        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refunds" element={<Refunds />} />

        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/seller-login" element={<SellerLogin />} />

        <Route
          path="/buyer/dashboard"
          element={
            <RequireAuth allowRole="buyer">
              <BuyerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <RequireAuth allowRole="seller">
              <SellerDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
