// src/components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const isBuyer = user && role === "buyer";
  const isSeller = user && role === "seller";

  const handleBuyerClick = () => {
    if (!isBuyer) {
      navigate("/buyer-login");
      return;
    }
    navigate("/buyer-dashboard");
  };

  const handleSellerClick = () => {
    if (!isSeller) {
      navigate("/seller-login");
      return;
    }
    navigate("/seller-dashboard");
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Clicking this reloads / and rotates landing images */}
        <a href="/" className="logo">
          <span className="logo-main">Picsell</span>{" "}
          <span className="logo-accent">art</span>
        </a>

        <nav className="nav-links">
          <NavLink to="/explore" className="nav-link">
            Explore
          </NavLink>
          <NavLink to="/faq" className="nav-link">
            FAQ
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
          <NavLink to="/refunds" className="nav-link">
            Refunds
          </NavLink>
        </nav>

        <div className="header-actions">
          {isBuyer && (
            <>
              <button
                className="pill-button secondary"
                onClick={() => navigate("/buyer-dashboard")}
              >
                My Downloads
              </button>
            </>
          )}

          {isSeller && (
            <>
              <button
                className="pill-button secondary"
                onClick={() => navigate("/seller-dashboard")}
              >
                Seller Dashboard
              </button>
            </>
          )}

          {!user && (
            <>
              <button
                className="pill-button secondary"
                onClick={handleBuyerClick}
              >
                Buyer Login
              </button>
              <button
                className="pill-button primary"
                onClick={handleSellerClick}
              >
                Seller Login
              </button>
            </>
          )}

          {user && (
            <button className="pill-button ghost" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
