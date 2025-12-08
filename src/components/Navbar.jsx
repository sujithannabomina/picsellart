// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "/picsellart-logo.png"; // adjust if your logo path is different

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
        <button className="brand" onClick={() => navigate("/")}>
          <span className="brand-dot" />
          <span className="brand-name">Picsellart</span>
        </button>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/refunds">Refunds</NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              {role === "buyer" && (
                <button
                  className="pill-button secondary"
                  onClick={() => navigate("/buyer-dashboard")}
                >
                  Buyer Dashboard
                </button>
              )}
              {role === "seller" && (
                <button
                  className="pill-button secondary"
                  onClick={() => navigate("/seller-dashboard")}
                >
                  Seller Dashboard
                </button>
              )}
              <button className="pill-button primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="pill-button secondary"
                onClick={() => navigate("/buyer-login")}
              >
                Buyer Login
              </button>
              <button
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
