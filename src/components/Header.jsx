import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="PicSellArt" height="28" />
          <span>PicSellArt</span>
        </Link>

        <nav className="nav">
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="cta">
          <Link to="/buyer-login" className="btn btn-outline">Buyer Login</Link>
          <Link to="/seller-login" className="btn btn-primary">Seller Login</Link>
        </div>
      </div>
    </header>
  );
}
