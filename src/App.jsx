import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Faq from "./pages/Faq.jsx";
import Contact from "./pages/Contact.jsx";
import Refunds from "./pages/Refunds.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import SellerLogin from "./pages/SellerLogin.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import ViewImage from "./pages/ViewImage.jsx";
import NotFound from "./pages/NotFound.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="app-root">
      <Navbar />

      <div className="page-wrapper">
        <div className="page-inner">
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refunds" element={<Refunds />} />

            {/* Auth pages */}
            <Route path="/buyer-login" element={<BuyerLogin />} />
            <Route path="/seller-login" element={<SellerLogin />} />

            {/* Dashboards (protected) */}
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

            {/* View single image */}
            <Route path="/photo/:photoId" element={<ViewImage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
