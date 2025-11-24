import { Link } from "react-router-dom";
import "./Header.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">

        {/* Left Logo */}
        <Link to="/" className="nav-logo">
          Picsellart
        </Link>

        {/* Right Links */}
        <nav className="nav-links">
          <Link to="/explore">Explore</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/refunds">Refunds</Link>

          <Link to="/seller-login" className="nav-btn secondary">Seller Login</Link>
          <Link to="/buyer-login" className="nav-btn primary">Buyer Login</Link>
        </nav>
      </div>
    </header>
  );
}
