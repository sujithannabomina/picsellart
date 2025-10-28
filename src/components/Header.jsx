// /src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`nav-link ${pathname === to ? "active" : ""}`}
    >
      {children}
    </Link>
  );

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="brand">
          {/* Uses your /public/logo.png or /public/logo.svg automatically */}
          <img src="/logo.png" alt="Picsellart" className="brand__logo" onError={(e)=>{e.currentTarget.src="/logo.svg"}} />
          <span className="brand__name">Picsellart</span>
        </Link>

        <nav className="nav">
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/refund">Refunds</NavLink>
        </nav>

        <div className="header__cta">
          <Link className="btn btn-outline" to="/buyer">Buyer Login</Link>
          <Link className="btn btn-outline" to="/seller">Seller Login</Link>
          <Link className="btn btn-primary" to="/seller">Start Selling</Link>
        </div>
      </div>
    </header>
  );
}
