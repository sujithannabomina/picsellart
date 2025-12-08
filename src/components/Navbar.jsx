// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="site-header">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <button
          className="brand"
          type="button"
          onClick={() => navigate("/")}
        >
          {/* If you have picsellart-logo.png in /public, this will load it.
              If the path is different, ONLY the image will be broken,
              but the build will still work. */}
          <img
            src="/picsellart-logo.png"
            alt="Picsellart logo"
            className="brand-logo-img"
          />
          <span className="brand-name">Picsellart</span>
        </button>

        {/* Center nav links */}
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/refunds">Refunds</NavLink>
        </nav>

        {/* Right actions */}
        <div className="nav-actions">
          {user ? (
            <>
              {role === "buyer" && (
                <button
                  type="button"
                  className="pill-button secondary"
                  onClick={() => navigate("/buyer-dashboard")}
                >
                  Buyer Dashboard
                </button>
              )}
              {role === "seller" && (
                <button
                  type="button"
                  className="pill-button secondary"
                  onClick={() => navigate("/seller-dashboard")}
                >
                  Seller Dashboard
                </button>
              )}
              <button
                type="button"
                className="pill-button primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="pill-button secondary"
                onClick={() => navigate("/buyer-login")}
              >
                Buyer Login
              </button>
              <button
                type="button"
                className="pill-button primary"
                onClick={() => navigate("/seller-login")}
              >
                Seller Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
