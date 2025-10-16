// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import SellerPlan from "./pages/SellerPlan";
import SellerRenew from "./pages/SellerRenew";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import Contact from "./pages/Contact";
import Refund from "./pages/Refund";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refund" element={<Refund />} />

        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/plan" element={<SellerPlan />} />
        <Route path="/seller/renew" element={<SellerRenew />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
      </Routes>
    </ErrorBoundary>
  );
}
