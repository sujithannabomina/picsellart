// FILE: src/components/SiteHeader.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SiteHeader() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, activeRole, setActiveRole, logout } = useAuth();

  const dashboardHref = activeRole === "seller" ? "/seller-dashboard" : "/buyer-dashboard";

  function switchRole(next) {
    setActiveRole(next);
    // send them to the correct dashboard if already logged in
    if (user) nav(next === "seller" ? "/seller-dashboard" : "/buyer-dashboard");
  }

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #eee" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#111" }}>
          <img src="/logo-round-128.png" alt="Picsellart" style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid #eaeaea" }} />
          <div style={{ fontWeight: 600, letterSpacing: 0.2 }}>Picsellart</div>
        </Link>

        <div style={{ flex: 1 }} />

        <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/" style={{ color: loc.pathname === "/" ? "#6d28d9" : "#444", textDecoration: "none", fontWeight: 500 }}>Home</Link>
          <Link to="/explore" style={{ color: loc.pathname.startsWith("/explore") ? "#6d28d9" : "#444", textDecoration: "none", fontWeight: 500 }}>Explore</Link>
          <Link to="/faq" style={{ color: loc.pathname.startsWith("/faq") ? "#6d28d9" : "#444", textDecoration: "none", fontWeight: 500 }}>FAQ</Link>
          <Link to="/contact" style={{ color: loc.pathname.startsWith("/contact") ? "#6d28d9" : "#444", textDecoration: "none", fontWeight: 500 }}>Contact</Link>
          <Link to="/refunds" style={{ color: loc.pathname.startsWith("/refunds") ? "#6d28d9" : "#444", textDecoration: "none", fontWeight: 500 }}>Refunds</Link>
        </nav>

        <div style={{ flex: 1 }} />

        {!user ? (
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/buyer-login" style={btnGhost}>Buyer Login</Link>
            <Link to="/seller-login" style={btnPrimary}>Seller Login</Link>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", border: "1px solid #eee", borderRadius: 999, overflow: "hidden" }}>
              <button onClick={() => switchRole("buyer")} style={activeRole === "buyer" ? pillActive : pill}>Buyer</button>
              <button onClick={() => switchRole("seller")} style={activeRole === "seller" ? pillActive : pill}>Seller</button>
            </div>

            <Link to={dashboardHref} style={btnGhost}>Dashboard</Link>
            <button onClick={logout} style={btnPrimary}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

const btnGhost = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #eaeaea",
  background: "#fff",
  color: "#222",
  textDecoration: "none",
  fontWeight: 500,
};

const btnPrimary = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid transparent",
  background: "#7c3aed",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 500,
};

const pill = {
  padding: "8px 12px",
  border: "none",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 500,
  color: "#333",
};

const pillActive = {
  ...pill,
  background: "#f4f0ff",
  color: "#5b21b6",
};
