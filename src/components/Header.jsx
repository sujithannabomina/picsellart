// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { pathname } = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-1 rounded-md text-sm font-medium hover:underline ${
        pathname === to ? "text-blue-700" : "text-slate-800"
      }`}
    >
      {label}
    </Link>
  );

  const pill = (to, label) => (
    <Link
      to={to}
      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold
                 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
    >
      {label}
    </Link>
  );

  return (
    <header className="w-full border-b border-slate-200 mb-6">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-slate-900">Picsellart</Link>

        <nav className="flex items-center gap-4">
          {navLink("/explore", "Explore")}
          {navLink("/faq", "FAQ")}
          {navLink("/contact", "Contact")}
          {navLink("/refunds", "Refunds")}
        </nav>

        <div className="flex items-center gap-2">
          {pill("/buyer", "Buyer Login")}
          {pill("/seller", "Seller Login")}
        </div>
      </div>
    </header>
  );
}
