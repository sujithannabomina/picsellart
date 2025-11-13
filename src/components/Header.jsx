import { Link, NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="ps-header">
      <div className="ps-header-inner">
        <Link to="/" className="ps-brand" aria-label="Picsellart home">
          <span className="ps-brand-left">Picsell</span>
          <span className="ps-brand-right">art</span>
        </Link>

        <nav className="ps-nav">
          <NavLink to="/explore" className={({isActive}) => isActive ? "ps-nav-link active" : "ps-nav-link"}>
            Explore
          </NavLink>
          <NavLink to="/faq" className={({isActive}) => isActive ? "ps-nav-link active" : "ps-nav-link"}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? "ps-nav-link active" : "ps-nav-link"}>
            Contact
          </NavLink>
          <NavLink to="/refunds" className={({isActive}) => isActive ? "ps-nav-link active" : "ps-nav-link"}>
            Refunds
          </NavLink>
        </nav>

        <div className="ps-actions">
          <Link to="/buyer-login" className="ps-btn ghost" aria-label="Buyer login">
            Buyer Login
          </Link>
          <Link to="/seller-login" className="ps-btn primary" aria-label="Seller login">
            Seller Login
          </Link>
        </div>
      </div>
    </header>
  );
}
