// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";          // <— IMPORTANT: matches file name Faq.jsx
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import ViewImage from "./pages/ViewImage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Top navigation bar with logo + links */}
        <Navbar />

        {/* Page routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refunds" element={<Refunds />} />

          {/* Auth pages */}
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />

          {/* View image page */}
          <Route path="/view/:photoId" element={<ViewImage />} />

          {/* Fallback – send anything unknown to home (or you can point to Explore) */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
