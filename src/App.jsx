import React, { Suspense, lazy } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";

/**
 * We lazy-load pages so missing ones won't break the whole build.
 * Make sure these filenames match the files in src/pages/.
 */
const HomePage           = lazy(() => import("./pages/HomePage.jsx"));
const ExplorePage        = lazy(() => import("./pages/ExplorePage.jsx"));
const SellPage           = lazy(() => import("./pages/SellPage.jsx"));
const SellerLogin        = lazy(() => import("./pages/SellerLogin.jsx"));
const SellerDashboard    = lazy(() => import("./pages/SellerDashboard.jsx"));
const SellerUpload       = lazy(() => import("./pages/SellerUpload.jsx"));
const BuyerLogin         = lazy(() => import("./pages/BuyerLogin.jsx"));
const BuyerDashboard     = lazy(() => import("./pages/BuyerDashboard.jsx"));
const ContactPage        = lazy(() => import("./pages/ContactPage.jsx"));
const FAQPage            = lazy(() => import("./pages/FAQPage.jsx"));
const RefundPolicyPage   = lazy(() => import("./pages/RefundPolicyPage.jsx"));

/** Simple site header. If you already have src/components/Navbar.jsx, you can swap it in. */
function Header() {
  const linkStyle = ({ isActive }) => ({
    padding: "8px 10px",
    color: isActive ? "#111" : "#444",
    fontWeight: isActive ? 700 : 500,
    textDecoration: "none",
  });

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "#fff",
      borderBottom: "1px solid #eee"
    }}>
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        maxWidth: 1140,
        margin: "0 auto",
        padding: "12px 16px"
      }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo.png" alt="Picsellart" height="28" />
          <strong style={{ color: "#111", letterSpacing: 0.3 }}>Picsellart</strong>
        </Link>

        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <NavLink to="/explore" style={linkStyle}>Explore</NavLink>
          <NavLink to="/sell" style={linkStyle}>Sell</NavLink>
          <NavLink to="/faq" style={linkStyle}>FAQ</NavLink>
          <NavLink to="/contact" style={linkStyle}>Contact</NavLink>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #eee", marginTop: 40, padding: "24px 16px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", gap: 16, flexWrap: "wrap" }}>
        <span>© {new Date().getFullYear()} Picsellart. All rights reserved.</span>
        <span style={{ marginLeft: "auto" }}>
          <Link to="/refund-policy" style={{ textDecoration: "none", color: "#111" }}>Refund Policy</Link>
        </span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, width: "100%", maxWidth: 1140, margin: "0 auto", padding: "24px 16px" }}>
        {/* Suspense fallback while pages load */}
        <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />

            {/* Seller flow */}
            <Route path="/sell" element={<SellPage />} />
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/upload" element={<SellerUpload />} />

            {/* Buyer flow */}
            <Route path="/buyer-login" element={<BuyerLogin />} />
            <Route path="/buyer" element={<BuyerDashboard />} />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div style={{ padding: 24 }}>
                  <h1>404</h1>
                  <p>Page not found.</p>
                  <p>
                    Go back to <Link to="/">Home</Link>.
                  </p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
