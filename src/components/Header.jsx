// src/components/Header.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const navItems = [
  { path: "/explore", label: "Explore" },
  { path: "/faq", label: "FAQ" },
  { path: "/contact", label: "Contact" },
  { path: "/refunds", label: "Refunds" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Brand */}
        <button
          className="brand"
          onClick={() => navigate("/")}
          aria-label="Go to homepage"
        >
          <span className="brand-mark">●</span>
          <span className="brand-text">Picsellart</span>
        </button>

        {/* Navigation */}
        <nav className="site-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                "nav-link" + (isActive(item.path) ? " nav-link-active" : "")
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="header-actions">
          <button
            className="header-btn ghost"
            onClick={() => navigate("/buyer-login")}
          >
            Buyer Login
          </button>
          <button
            className="header-btn primary"
            onClick={() => navigate("/seller-login")}
          >
            Seller Login
          </button>
        </div>
      </div>
    </header>
  );
}
