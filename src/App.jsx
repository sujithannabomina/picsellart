import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";

// Try to import your pages; if not present, fall back to stubs.
// This avoids Vercel build breaks if a page file is temporarily absent.
let Landing;
try {
  Landing = (await import("./pages/LandingPage.jsx")).default;
} catch {
  Landing = function LandingFallback() {
    return (
      <main className="section container">
        <h1>Welcome to Picsellart</h1>
        <p>LandingPage.jsx is not found; showing a safe fallback.</p>
      </main>
    );
  };
}

let Explore;
try {
  Explore = (await import("./pages/Explore.jsx")).default;
} catch {
  Explore = function ExploreFallback() {
    return (
      <main className="section container">
        <h1>Explore Pictures</h1>
        <p>Explore.jsx is missing; fallback rendered to keep build healthy.</p>
      </main>
    );
  };
}

let Faq;
try {
  Faq = (await import("./pages/Faq.jsx")).default;
} catch {
  Faq = () => (
    <main className="section container">
      <h1>FAQ</h1>
      <p>Faq.jsx not found; fallback in use.</p>
    </main>
  );
}

let Refund;
try {
  Refund = (await import("./pages/Refund.jsx")).default;
} catch {
  Refund = () => (
    <main className="section container">
      <h1>Refund</h1>
      <p>Refund.jsx not found; fallback in use.</p>
    </main>
  );
}

let Contact;
try {
  Contact = (await import("./pages/Contact.jsx")).default;
} catch {
  Contact = () => (
    <main className="section container">
      <h1>Contact</h1>
      <p>Contact.jsx not found; fallback in use.</p>
    </main>
  );
}

let BuyerLogin;
try {
  BuyerLogin = (await import("./pages/BuyerLogin.jsx")).default;
} catch {
  BuyerLogin = () => (
    <main className="section container">
      <h1>Buyer Login</h1>
      <p>BuyerLogin.jsx not found; fallback in use.</p>
    </main>
  );
}

let SellerLogin;
try {
  SellerLogin = (await import("./pages/SellerLogin.jsx")).default;
} catch {
  SellerLogin = () => (
    <main className="section container">
      <h1>Seller Login</h1>
      <p>SellerLogin.jsx not found; fallback in use.</p>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          {/* Fallback route */}
          <Route
            path="*"
            element={
              <main className="section container">
                <h1>404</h1>
                <p>Page not found.</p>
              </main>
            }
          />
        </Routes>
      </div>

      <footer>
        © {new Date().getFullYear()} Picsellart. All rights reserved.
      </footer>
    </div>
  );
}
