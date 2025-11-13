// src/components/Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const goHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <header className="ps-header">
      <div className="ps-header-inner">
        {/* Logo / Brand */}
        <button className="ps-logo" onClick={goHome}>
          <span className="ps-logo-main">Picsell</span>
          <span className="ps-logo-accent"> art</span>
        </button>

        {/* Main navigation */}
        <nav className="ps-nav">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            FAQ
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/refunds"
            className={({ isActive }) =>
              isActive ? "ps-nav-link ps-nav-link-active" : "ps-nav-link"
            }
          >
            Refunds
          </NavLink>
        </nav>

        {/* Auth buttons – these just route; actual auth happens in the pages */}
        <div className="ps-auth-actions">
          <NavLink
            to="/buyer-login"
            className={({ isActive }) =>
              isActive ? "ps-auth-btn ps-auth-btn-outline ps-auth-btn-active" : "ps-auth-btn ps-auth-btn-outline"
            }
          >
            Buyer Login
          </NavLink>

          <NavLink
            to="/seller-login"
            className={({ isActive }) =>
              isActive ? "ps-auth-btn ps-auth-btn-primary ps-auth-btn-active" : "ps-auth-btn ps-auth-btn-primary"
            }
          >
            Seller Login
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
