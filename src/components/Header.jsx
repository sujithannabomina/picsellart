// FILE: src/components/Header.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, mode, switchMode, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const isSeller = mode === "seller";

  return (
    <div style={{ borderBottom: "1px solid #eee", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#111" }}>
          <img src="/logo-round-128.png" alt="Picsellart" style={{ width: 30, height: 30, borderRadius: 999 }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Picsellart</span>
        </Link>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#444" }}>Home</Link>
          <Link to="/explore" style={{ textDecoration: "none", color: "#444" }}>Explore</Link>
          <Link to="/faq" style={{ textDecoration: "none", color: "#444" }}>FAQ</Link>
          <Link to="/contact" style={{ textDecoration: "none", color: "#444" }}>Contact</Link>
          <Link to="/refunds" style={{ textDecoration: "none", color: "#444" }}>Refunds</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!user ? (
            <>
              <button className="psa-btn" onClick={() => nav("/buyer-login")}>Buyer Login</button>
              <button className="psa-btn psa-btn-primary" onClick={() => nav("/seller-login")}>Seller Login</button>
            </>
          ) : (
            <>
              <span style={{ fontSize: 13, color: "#777" }}>
                Mode: <span style={{ fontWeight: 500 }}>{isSeller ? "Seller" : "Buyer"}</span>
              </span>

              <button
                className="psa-btn"
                onClick={() => {
                  const next = isSeller ? "buyer" : "seller";
                  switchMode(next);
                  // Don’t auto-navigate away from where they are; only adjust dashboard button behavior.
                }}
              >
                Switch to {isSeller ? "Buyer" : "Seller"}
              </button>

              <button
                className="psa-btn"
                onClick={() => nav(isSeller ? "/seller-dashboard" : "/buyer-dashboard")}
              >
                Dashboard
              </button>

              <button className="psa-btn psa-btn-primary" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>

      {/* subtle route awareness for internal debugging */}
      <div style={{ height: 1, background: "transparent" }} data-route={loc.pathname} />
    </div>
  );
}
