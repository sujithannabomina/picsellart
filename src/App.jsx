import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import RefundPolicy from "./pages/RefundPolicy";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/buyer" element={<BuyerDashboard />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/buyer-login" element={<BuyerLogin />} />
      <Route path="/seller-login" element={<SellerLogin />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refund" element={<RefundPolicy />} />
    </Routes>
  );
}

export default App;
