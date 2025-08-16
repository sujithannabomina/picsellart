// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages (make sure these files exist)
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import SellerLogin from "./pages/SellerLogin";      // optional placeholders
import BuyerLogin from "./pages/BuyerLogin";        // optional placeholders
import SellerDashboard from "./pages/SellerDashboard"; // optional
import NotFound from "./pages/NotFound";            // optional

export default function App() {
  return (
    <>
      <Navbar />
      {/* Push content below the 64px sticky navbar */}
      <div style={{ paddingTop: 64, minHeight: "100vh", background: "#fff" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
