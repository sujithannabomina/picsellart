// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
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
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/refunds" element={<Refunds />} />

              <Route path="/buyer/login" element={<BuyerLogin />} />
              <Route path="/seller/login" element={<SellerLogin />} />

              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/view/:id" element={<ViewImage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
