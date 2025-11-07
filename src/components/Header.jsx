// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, signInAsBuyer, signInAsSeller, signOut } = useAuth();
  const { pathname } = useLocation();

  const link = (to, label) => (
    <Link
      to={to}
      className={`hover:underline ${pathname === to ? "font-semibold" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <nav className="flex flex-wrap items-center gap-4 text-slate-800">
          {link("/", "Picsellart")}
          {link("/explore", "Explore")}
          {link("/faq", "FAQ")}
          {link("/contact", "Contact")}
          {link("/refunds", "Refunds")}
          {user && link("/buyer/dashboard", "Buyer Dashboard")}
          {user && link("/seller/dashboard", "Seller Dashboard")}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <button
                className="px-3 py-1.5 text-sm rounded-md border"
                onClick={signInAsBuyer}
              >
                Buyer Login
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white"
                onClick={signInAsSeller}
              >
                Seller Login
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-600 truncate max-w-[180px]">
                {user.displayName || user.email}
              </span>
              <button
                className="px-3 py-1.5 text-sm rounded-md border"
                onClick={signOut}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
