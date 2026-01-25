import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm ${
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PicSellArt"
              className="h-9 w-9 rounded-xl object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="font-semibold tracking-tight text-slate-900">PicSellArt</div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/explore">Explore</NavItem>
            <NavItem to="/faq">FAQ</NavItem>
            <NavItem to="/contact">Contact</NavItem>
            <NavItem to="/refunds">Refunds</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link
                  to="/buyer-login"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
                >
                  Buyer Login
                </Link>
                <Link
                  to="/seller-login"
                  className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:bg-slate-900"
                >
                  Seller Login
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => nav("/buyer-dashboard")}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:bg-slate-900"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
