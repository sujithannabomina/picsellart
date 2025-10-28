// src/App.jsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";

const LandingPage   = lazy(() => import("./pages/LandingPage"));
const Explore       = lazy(() => import("./pages/Explore"));
const BuyerLogin    = lazy(() => import("./pages/BuyerLogin"));
const SellerLogin   = lazy(() => import("./pages/SellerLogin"));
const Faq           = lazy(() => import("./pages/Faq"));      // <-- correct filename
const Contact       = lazy(() => import("./pages/Contact"));
const Refunds       = lazy(() => import("./pages/Refunds"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Suspense fallback={<div className="pageWrap"><p className="muted">Loading…</p></div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/buyer" element={<BuyerLogin />} />
            <Route path="/seller" element={<SellerLogin />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refunds" element={<Refunds />} />
            {/* simple 404 */}
            <Route path="*" element={<div className="pageWrap"><h2>Not Found</h2></div>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
