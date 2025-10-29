import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Explore from "./pages/Explore";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import SellerDashboard from "./pages/SellerDashboard";
import SellerSubscribe from "./pages/SellerSubscribe";
import PhotoDetails from "./pages/PhotoDetails";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";       // keep yours
import Refunds from "./pages/Refunds";       // keep yours
import NotFound from "./pages/NotFound";     // keep yours
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/explore" replace />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/photo/:id" element={<PhotoDetails />} />

          <Route path="/buyer" element={<BuyerLogin />} />
          <Route path="/buyer/dashboard" element={<Navigate to="/explore" replace />} /> {/* simple buyer dash */}

          <Route path="/seller" element={<SellerLogin />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/subscribe" element={<SellerSubscribe />} />

          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refunds" element={<Refunds />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
