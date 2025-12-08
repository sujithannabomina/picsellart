// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
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

const App = () => {
  return (
    <div className="app-root">
      <Routes>
        {/* All public pages share the same layout (navbar + background) */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/view/:id" element={<ViewImage />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />

          {/* Protected dashboards */}
          <Route element={<ProtectedRoute role="buyer" />}>
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute role="seller" />}>
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
