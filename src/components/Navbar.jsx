// src/components/Navbar.jsx
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if user is already on login pages (so we can avoid confusing "Login" clicks)
  const isBuyerLogin = location.pathname.startsWith("/buyer-login");
  const isSellerLogin = location.pathname.startsWith("/seller-login");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo + brand */}
        <button
          className="nav-logo"
          onClick={() => navigate("/")}
          aria-label="Go to home"
          type="button"
        >
          <img src="/logo.png" alt="Picsellart logo" />
          <span>Picsellart</span>
        </button>

        {/* Center navigation */}
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            Explore
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            FAQ
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            Contact
          </NavLink>

          <NavLink
            to="/refunds"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " nav-link-active" : "")
            }
          >
            Refunds
          </NavLink>
        </nav>

        {/* Right side actions */}
        <div className="nav-actions">
          <button
            className="btn btn-nav"
            type="button"
            onClick={() => {
              if (!isBuyerLogin) navigate("/buyer-login");
            }}
            aria-current={isBuyerLogin ? "page" : undefined}
            disabled={isBuyerLogin}
            style={isBuyerLogin ? { opacity: 0.7, cursor: "default" } : undefined}
          >
            Buyer Login
          </button>

          <button
            className="btn btn-nav-primary"
            type="button"
            onClick={() => {
              if (!isSellerLogin) navigate("/seller-login");
            }}
            aria-current={isSellerLogin ? "page" : undefined}
            disabled={isSellerLogin}
            style={isSellerLogin ? { opacity: 0.75, cursor: "default" } : undefined}
          >
            Seller Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
