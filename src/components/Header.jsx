import { NavLink, Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link to="/" className="brand" aria-label="Picsellart">
          {/* uses /public/logo.png automatically */}
          <img src="/logo.png" alt="Picsellart logo" />
          <span>Picsellart</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          <NavLink to="/explore" className={({isActive}) => isActive ? "active" : undefined}>Explore</NavLink>
          <NavLink to="/faq" className={({isActive}) => isActive ? "active" : undefined}>FAQ</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? "active" : undefined}>Contact</NavLink>
          <NavLink to="/refund" className={({isActive}) => isActive ? "active" : undefined}>Refunds</NavLink>
        </nav>

        <div className="nav-cta">
          <Link to="/buyer/login" className="ghost">Buyer Login</Link>
          <Link to="/seller/login" className="ghost">Seller Login</Link>
          <Link
            to="/seller/subscribe"
            className="primary"
            aria-current={pathname.startsWith("/seller") ? "page" : undefined}
          >
            Start Selling
          </Link>
        </div>
      </div>
    </header>
  );
}
