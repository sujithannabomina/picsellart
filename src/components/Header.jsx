import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Brand */}
        <Link to="/" className="site-brand">
          Picsell<span>art</span>
        </Link>

        {/* Primary nav */}
        <nav className="nav-main">
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/refunds">Refunds</NavLink>
        </nav>

        {/* Auth actions */}
        <div className="nav-auth">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/buyer-login")}
          >
            Buyer Login
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/seller-login")}
          >
            Seller Login
          </button>
        </div>
      </div>
    </header>
  );
}
