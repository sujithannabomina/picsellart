import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, role, loginBuyer, loginSeller, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // close role menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // click outside to close
  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const Brand = (
    <button
      onClick={() => navigate("/")}
      className="brand"
      aria-label="Picsellart home"
    >
      <span className="brand-left">Picsell</span>
      <span className="brand-right">art</span>
    </button>
  );

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {Brand}

        <nav className="main-nav">
          <NavLink className="navlink" to="/explore">Explore</NavLink>
          <NavLink className="navlink" to="/faq">FAQ</NavLink>
          <NavLink className="navlink" to="/contact">Contact</NavLink>
          <NavLink className="navlink" to="/refunds">Refunds</NavLink>
        </nav>

        <div className="actions" ref={menuRef}>
          {!user && (
            <>
              <button
                className="btn ghost"
                onClick={() => loginBuyer().then(() => navigate("/buyer-dashboard"))}
              >
                Buyer Login
              </button>
              <button
                className="btn primary"
                onClick={() =>
                  loginSeller().then(() => navigate("/seller-gateway"))
                }
              >
                Seller Login
              </button>
            </>
          )}

          {user && role === "buyer" && (
            <div className="role-menu">
              <button
                className="btn ghost"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                {user.displayName || "Buyer"} ▾
              </button>
              {open && (
                <div className="menu">
                  <button onClick={() => navigate("/buyer-dashboard")}>
                    Purchases
                  </button>
                  <button onClick={() => navigate("/profile")}>Profile</button>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}

          {user && role === "seller" && (
            <div className="role-menu">
              <button
                className="btn primary"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                {user.displayName || "Seller"} ▾
              </button>
              {open && (
                <div className="menu">
                  <button onClick={() => navigate("/seller-dashboard")}>
                    Dashboard
                  </button>
                  <button onClick={() => navigate("/profile")}>Profile</button>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
