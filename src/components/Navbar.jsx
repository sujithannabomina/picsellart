import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "text-purple-700" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <img
            src="/logo.png"
            alt="Picsellart"
            className="h-9 w-9 rounded-full object-cover border"
          />
          <span className="font-semibold text-gray-900">Picsellart</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/faq" className={linkClass}>FAQ</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <NavLink to="/refunds" className={linkClass}>Refunds</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden md:inline text-xs text-gray-500">
                {role ? `Logged in as ${role}` : "Logged in"}
              </span>
              <button
                onClick={() => navigate(role === "seller" ? "/seller-dashboard" : "/buyer-dashboard")}
                className="px-4 py-2 rounded-full text-sm border bg-white hover:bg-gray-50"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full text-sm bg-purple-600 text-white hover:bg-purple-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/buyer-login")}
                className="px-4 py-2 rounded-full text-sm border bg-white hover:bg-gray-50"
              >
                Buyer Login
              </button>
              <button
                onClick={() => navigate("/seller-login")}
                className="px-4 py-2 rounded-full text-sm bg-purple-600 text-white hover:bg-purple-700"
              >
                Seller Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
