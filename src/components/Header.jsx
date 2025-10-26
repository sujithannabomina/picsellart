import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="psa-header">
      <div className="psa-header-inner">
        {/* Logo / Brand */}
        <Link to="/" className="psa-brand" aria-label="Picsellart Home">
          <img
            src="/logo.svg"
            alt="Picsellart"
            className="psa-logo"
            height="28"
            width="28"
          />
          <span className="psa-brand-text">Picsellart</span>
        </Link>

        {/* Primary Nav */}
        <nav className="psa-nav">
          <NavLink to="/explore" className="psa-nav-link">
            Explore
          </NavLink>
          <NavLink to="/faq" className="psa-nav-link">
            FAQ
          </NavLink>
          <NavLink to="/contact" className="psa-nav-link">
            Contact
          </NavLink>
          <NavLink to="/license" className="psa-nav-link">
            License
          </NavLink>
          <NavLink to="/refund" className="psa-nav-link">
            Refunds
          </NavLink>
        </nav>

        {/* Auth + CTA */}
        <div className="psa-actions">
          <Link to="/buyer-login" className="btn btn-ghost">
            Buyer Login
          </Link>
          <Link to="/seller-login" className="btn btn-ghost">
            Seller Login
          </Link>
          <Link to="/seller-subscribe" className="btn btn-primary">
            Start Selling
          </Link>
        </div>
      </div>
    </header>
  );
}
