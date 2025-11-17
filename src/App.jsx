// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import ViewImage from "./pages/ViewImage";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refunds" element={<Refunds />} />

            {/* View single image (watermarked) */}
            <Route path="/view/:id" element={<ViewImage />} />

            {/* Login pages (backup – header buttons can also trigger login) */}
            <Route path="/buyer-login" element={<BuyerLogin />} />
            <Route path="/seller-login" element={<SellerLogin />} />

            {/* Protected dashboards */}
            <Route
              path="/buyer-dashboard"
              element={
                <ProtectedRoute role="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller-dashboard"
              element={
                <ProtectedRoute role="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
