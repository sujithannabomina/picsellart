import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "px-3 py-2 text-sm rounded-full transition hover:bg-black/5";
const active =
  "bg-black/5 font-medium";

export default function Navbar() {
  const { user, roles, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => nav("/")}
          className="flex items-center gap-3"
        >
          <img
            src="/logo.png"
            alt="Picsellart"
            className="h-9 w-9 rounded-full object-cover border border-black/10"
          />
          <span className="font-semibold">Picsellart</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>Home</NavLink>
          <NavLink to="/explore" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>Explore</NavLink>
          <NavLink to="/faq" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>FAQ</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>Contact</NavLink>
          <NavLink to="/refunds" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>Refunds</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <button
                type="button"
                onClick={() => nav("/buyer-login")}
                className="px-4 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5"
              >
                Buyer Login
              </button>
              <button
                type="button"
                onClick={() => nav("/seller-login")}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm shadow hover:opacity-95"
              >
                Seller Login
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => nav(roles.seller ? "/seller-dashboard" : "/seller-login")}
                className="px-4 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5"
              >
                Seller Dashboard
              </button>
              <button
                type="button"
                onClick={() => nav(roles.buyer ? "/buyer-dashboard" : "/buyer-login")}
                className="px-4 py-2 rounded-full border border-black/10 text-sm hover:bg-black/5"
              >
                Buyer Dashboard
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-full bg-black text-white text-sm hover:opacity-90"
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
