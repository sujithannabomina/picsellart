import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import FAQ from "./pages/Faq";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerGateway from "./pages/SellerGateway";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refunds" element={<Refunds />} />

            {/* dashboards / flows */}
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/seller-gateway" element={<SellerGateway />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

