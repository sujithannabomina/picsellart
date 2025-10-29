// src/App.jsx
import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages (keep these imports aligned with your /src/pages filenames)
import LandingPage from "./pages/LandingPage";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerSubscribe from "./pages/SellerSubscribe";
import SellerPlan from "./pages/SellerPlan";
import SellerRenew from "./pages/SellerRenew";
import SellerOnboarding from "./pages/SellerOnboarding";
import PhotoDetails from "./pages/PhotoDetails";
import PhotoDetail from "./pages/PhotoDetail"; // if you keep both variants
import Refunds from "./pages/Refunds";
import Refund from "./pages/Refund";
import License from "./pages/License";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";

// Scroll to top on route change (SPA polish)
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // allow intra-page anchors
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    // HashRouter avoids server rewrites and fixes /explore 404 on Vercel
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Public shell with header/footer */}
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="explore" element={<Explore />} />
          <Route path="contact" element={<Contact />} />

          {/* Auth & onboarding flows */}
          <Route path="buyer/login" element={<BuyerLogin />} />
          <Route path="seller/login" element={<SellerLogin />} />
          <Route path="seller/subscribe" element={<SellerSubscribe />} />
          <Route path="seller/plan" element={<SellerPlan />} />
          <Route path="seller/renew" element={<SellerRenew />} />
          <Route path="seller/onboarding" element={<SellerOnboarding />} />

          {/* Details */}
          <Route path="photo/:id" element={<PhotoDetails />} />
          {/* keep legacy route if you have it */}
          <Route path="photos/:id" element={<PhotoDetail />} />

          {/* Static info pages */}
          <Route path="refunds" element={<Refunds />} />
          <Route path="refund" element={<Refund />} />
          <Route path="license" element={<License />} />
          <Route path="faq" element={<Faq />} />

          {/* Dashboards (protected) */}
          <Route
            path="seller/dashboard"
            element={
              <ProtectedRoute role="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="buyer/dashboard"
            element={
              <ProtectedRoute role="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Convenience redirects */}
          <Route path="home" element={<Navigate to="/" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
