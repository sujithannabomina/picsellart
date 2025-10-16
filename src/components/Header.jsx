// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const ctx = useAuth(); // never null after our fix
  const user = ctx?.user ?? null;
  const loading = ctx?.loading ?? false;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/logo.png" alt="Picsellart" className="logo" />
          <span>Picsellart</span>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/refund">Refund</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="actions">
          {loading ? null : user ? (
            <>
              <Link to="/seller/dashboard" className="link">Dashboard</Link>
              <button
                className="btn ghost"
                onClick={async () => {
                  await ctx.signOut();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/buyer/login" className="link">Buyer Login</Link>
              <Link to="/seller/login" className="btn primary">Seller Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
