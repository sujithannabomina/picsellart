import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Explore from "./pages/Explore.jsx";
import BuyerLogin from "./pages/BuyerLogin.jsx";
import SellerLogin from "./pages/SellerLogin.jsx";
import FAQ from "./pages/FAQ.jsx";
import Contact from "./pages/Contact.jsx";
import Refund from "./pages/Refund.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/buyer" element={<BuyerLogin />} />
        <Route path="/seller" element={<SellerLogin />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
    </div>
  );
}
