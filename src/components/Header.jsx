// src/components/Header.jsx
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="siteHeader">
      <div className="wrap">
        <Link to="/" className="brand">
          <img src="/logo.png" alt="Picsellart" />
          <span>Picsellart</span>
        </Link>

        <nav className="nav">
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/refunds">Refunds</NavLink>
        </nav>

        <div className="actions">
          <Link to="/buyer" className="btn small outline">Buyer Login</Link>
          <Link to="/seller" className="btn small outline">Seller Login</Link>
          <Link to="/explore" className="btn small primary">Explore</Link>
        </div>
      </div>
    </header>
  );
}
