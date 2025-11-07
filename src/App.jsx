// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Explore from "./pages/Explore.jsx";
import Faq from "./pages/Faq.jsx";
import Contact from "./pages/Contact.jsx";
import Refunds from "./pages/Refunds.jsx";     // ensure this file exists; you already have Refunds.jsx in /pages
import SellerLogin from "./pages/SellerLogin.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import PhotoDetails from "./pages/PhotoDetails.jsx";
import NotFound from "./pages/NotFound.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/photo/:name" element={<PhotoDetails />} />

        {/* Static pages */}
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refunds" element={<Refunds />} />

        {/* Auth entry points used by the header buttons */}
        <Route path="/seller" element={<SellerLogin />} />
        <Route path="/buyer" element={<BuyerLogin />} />

        {/* Dashboards (assumes your ProtectedRoute wraps inside those pages, as in your repo) */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

        {/* Legacy/aliases (optional): if you had old paths, keep these redirects */}
        <Route path="/seller-login" element={<Navigate to="/seller" replace />} />
        <Route path="/buyer-login" element={<Navigate to="/buyer" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
