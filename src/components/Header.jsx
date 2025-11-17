// src/components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, isBuyer, isSeller, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-main">Picsell</span>
          <span className="logo-highlight">art</span>
        </Link>

        <nav className="main-nav">
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
          {!user && (
            <>
              <button
                className="btn-pill btn-ghost"
                onClick={() => navigate("/buyer-login")}
              >
                Buyer Login
              </button>
              <button
                className="btn-pill btn-primary"
                onClick={() => navigate("/seller-login")}
              >
                Seller Login
              </button>
            </>
          )}

          {isBuyer && (
            <>
              <button
                className="btn-pill btn-ghost"
                onClick={() => navigate("/buyer-dashboard")}
              >
                My Downloads
              </button>
              <button className="btn-pill btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {isSeller && (
            <>
              <button
                className="btn-pill btn-ghost"
                onClick={() => navigate("/seller-dashboard")}
              >
                Seller Dashboard
              </button>
              <button className="btn-pill btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
