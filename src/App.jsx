import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Explore from "./pages/Explore.jsx";
import Faq from "./pages/Faq.jsx";
import Contact from "./pages/Contact.jsx";
import Refund from "./pages/Refund.jsx";

/* These pages already exist in your repo; routes kept intact */
import SellerLogin from "./pages/SellerLogin.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import SellerSubscribe from "./pages/SellerSubscribe.jsx";

export default function App(){
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refund" element={<Refund />} />

        {/* Auth / Seller */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/seller/subscribe" element={<SellerSubscribe />} />

        {/* Legacy/removed: redirect /license -> /refund (or /faq, as you prefer) */}
        <Route path="/license" element={<Navigate to="/refund" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
