import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // if you have one
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerLogin from "./pages/SellerLogin";
import BuyerLogin from "./pages/BuyerLogin";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";

import RequireAuth from "./auth/RequireAuth";
import RequireRole from "./auth/RequireRole";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional: Navbar */}
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />

          {/* Logins */}
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/login" element={<Navigate to="/buyer-login" replace />} />

          {/* Protected Dashboards */}
          <Route
            path="/seller"
            element={
              <RequireRole role="seller">
                <SellerDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/buyer"
            element={
              <RequireRole role="buyer">
                <BuyerDashboard />
              </RequireRole>
            }
          />

          {/* Info pages */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
