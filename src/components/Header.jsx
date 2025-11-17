// src/components/Header.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const { user, login, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleBuyerLogin = () => {
    login("buyer"); // direct Google login, then go to buyer dashboard
  };

  const handleSellerLogin = () => {
    login("seller"); // direct Google login, then go to seller dashboard
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <header className="ps-header">
      <div className="ps-header-inner">
        {/* Logo / site name */}
        <button className="ps-logo" onClick={goHome}>
          <span className="ps-logo-main">Picsellart</span>
        </button>

        {/* Center nav links */}
        <nav className="ps-nav">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            FAQ
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/refunds"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            Refunds
          </NavLink>
        </nav>

        {/* Right side: login / account */}
        <div className="ps-auth-buttons">
          {user ? (
            <>
              <span className="ps-user-tag">
                {role === "seller" ? "Seller" : "Buyer"} • {user.displayName || "Account"}
              </span>
              <button className="ps-btn ps-btn-outline" onClick={logout}>
                Logout
              </button>
              {role === "seller" ? (
                <Link to="/seller-dashboard" className="ps-btn ps-btn-primary">
                  Dashboard
                </Link>
              ) : (
                <Link to="/buyer-dashboard" className="ps-btn ps-btn-primary">
                  Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <button className="ps-btn ps-btn-outline" onClick={handleBuyerLogin}>
                Buyer Login
              </button>
              <button className="ps-btn ps-btn-primary" onClick={handleSellerLogin}>
                Seller Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
