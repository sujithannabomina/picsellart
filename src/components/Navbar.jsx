import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/explore") {
      // treat /view/:id as part of explore
      return (
        location.pathname === "/explore" ||
        location.pathname.startsWith("/view/")
      );
    }
    return location.pathname === path;
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand */}
        <Link to="/" className="brand">
          <span className="brand-dot" />
          <span className="brand-text">Picsellart</span>
        </Link>

        {/* Center nav */}
        <nav className="nav-links" aria-label="Main navigation">
          <Link
            to="/explore"
            className={isActive("/explore") ? "nav-link active" : "nav-link"}
          >
            Explore
          </Link>
          <Link
            to="/faq"
            className={isActive("/faq") ? "nav-link active" : "nav-link"}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            className={isActive("/contact") ? "nav-link active" : "nav-link"}
          >
            Contact
          </Link>
          <Link
            to="/refunds"
            className={isActive("/refunds") ? "nav-link active" : "nav-link"}
          >
            Refunds
          </Link>
        </nav>

        {/* Right buttons */}
        <div className="header-actions">
          <Link to="/buyer-login" className="pill-button secondary small">
            Buyer Login
          </Link>
          <Link to="/seller-login" className="pill-button primary small">
            Seller Login
          </Link>
        </div>
      </div>
    </header>
  );
}
