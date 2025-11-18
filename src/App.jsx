// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import FAQ from "./pages/Faq";          // 👈 FIXED: Faq (not FAQ)
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import ViewImage from "./pages/ViewImage";

// Scroll to top when route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const navLinks = [
  { to: "/explore", label: "Explore" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/refunds", label: "Refunds" },
];

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Logo / brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-purple-500 shadow shadow-purple-500/60" />
          <span className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
            Picsellart
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden gap-6 text-xs font-medium text-slate-600 sm:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "relative pb-1 transition-colors",
                  isActive ? "text-slate-900" : "hover:text-slate-900",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-purple-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/buyer-login"
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:inline-block"
          >
            Buyer Login
          </Link>
          <Link
            to="/seller-login"
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-500/40 transition hover:brightness-105"
          >
            Seller Login
          </Link>
        </div>
      </div>
    </header>
  );
}

function Layout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Shared layout with header */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />

          {/* View page route – uses storage path after /view/ */}
          <Route path="/view/*" element={<ViewImage />} />

          {/* Fallback – if unknown path, show Home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}
