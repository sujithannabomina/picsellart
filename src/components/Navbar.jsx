// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo + brand */}
        <button
          className="nav-logo"
          onClick={() => navigate("/")}
          aria-label="Go to home"
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
            onClick={() => navigate("/buyer-login")}
          >
            Buyer Login
          </button>
          <button
            className="btn btn-nav-primary"
            onClick={() => navigate("/seller-login")}
          >
            Seller Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
