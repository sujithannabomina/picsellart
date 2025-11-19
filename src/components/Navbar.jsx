import { Link, useLocation } from "react-router-dom";

const navLinkBase =
  "text-sm md:text-base px-3 py-1 rounded-full transition-colors";
const navLinkActive = "text-violet-600";
const navLinkInactive = "text-slate-600 hover:text-slate-900";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (to) => (path === to ? navLinkActive : navLinkInactive);

  return (
    <header className="border-b border-slate-200 bg-slate-50/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full px-3 py-1 hover:bg-slate-100 transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
          <span className="font-semibold tracking-wide text-slate-900">
            Picsellart
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/explore" className={`${navLinkBase} ${isActive("/explore")}`}>
            Explore
          </Link>
          <Link to="/faq" className={`${navLinkBase} ${isActive("/faq")}`}>
            FAQ
          </Link>
          <Link to="/contact" className={`${navLinkBase} ${isActive("/contact")}`}>
            Contact
          </Link>
          <Link to="/refunds" className={`${navLinkBase} ${isActive("/refunds")}`}>
            Refunds
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/buyer-login"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Buyer Login
          </Link>
          <Link
            to="/seller-login"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md hover:shadow-lg"
          >
            Seller Login
          </Link>
        </div>
      </div>

      {/* mobile nav row */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50">
        <nav className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-center gap-2 text-xs">
          <Link to="/explore" className={`${navLinkBase} ${isActive("/explore")}`}>
            Explore
          </Link>
          <Link to="/faq" className={`${navLinkBase} ${isActive("/faq")}`}>
            FAQ
          </Link>
          <Link
            to="/contact"
            className={`${navLinkBase} ${isActive("/contact")}`}
          >
            Contact
          </Link>
          <Link
            to="/refunds"
            className={`${navLinkBase} ${isActive("/refunds")}`}
          >
            Refunds
          </Link>
        </nav>
      </div>
    </header>
  );
}
