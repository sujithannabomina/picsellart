// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";
import SellerLogin from "./pages/SellerLogin";
import BuyerLogin from "./pages/BuyerLogin";
import ViewImage from "./pages/ViewImage";

import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/view/:fileName" element={<ViewImage />} />

          {/* Fallback: send unknown paths to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
