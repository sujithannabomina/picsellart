// /src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Explore from "./pages/Explore.jsx";
import Faq from "./pages/Faq.jsx";
import Contact from "./pages/Contact.jsx";
import Refund from "./pages/Refund.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import SellerLogin from "./pages/SellerLogin.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/buyer" element={<BuyerLogin />} />
        <Route path="/seller" element={<SellerLogin />} />
        {/* legacy or unknown routes -> home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
