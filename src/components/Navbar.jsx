// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

const navLinkClasses =
  "text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors";

const activeNavLinkClasses =
  "text-sm font-semibold text-slate-900 border-b-2 border-purple-500 pb-1";

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
          <span className="text-lg font-semibold tracking-tight">
            Picsellart
          </span>
        </Link>

        {/* Center nav links */}
        <nav className="hidden gap-6 md:flex">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? activeNavLinkClasses : navLinkClasses
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              isActive ? activeNavLinkClasses : navLinkClasses
            }
          >
            FAQ
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? activeNavLinkClasses : navLinkClasses
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/refunds"
            className={({ isActive }) =>
              isActive ? activeNavLinkClasses : navLinkClasses
            }
          >
            Refunds
          </NavLink>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/buyer-login"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Buyer Login
          </Link>
          <Link
            to="/seller-login"
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Seller Login
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
