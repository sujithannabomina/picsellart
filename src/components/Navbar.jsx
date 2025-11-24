import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBrandClick = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand"
          onClick={handleBrandClick}
          aria-label="Go to Picsellart home"
        >
          <div className="brand-logo" />
          <span className="brand-name">Picsellart</span>
        </button>

        <nav className="main-nav">
          <NavLink to="/explore" className={linkClass}>
            Explore
          </NavLink>
          <NavLink to="/faq" className={linkClass}>
            FAQ
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          <NavLink to="/refunds" className={linkClass}>
            Refunds
          </NavLink>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="user-label">
                {user.role === "seller" ? "Seller" : "Buyer"}
              </span>
              <button
                type="button"
                className="pill-button secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/buyer-login" className="pill-button secondary">
                Buyer Login
              </NavLink>
              <NavLink to="/seller-login" className="pill-button primary">
                Seller Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
