import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#ffffff",
        borderBottom: "1px solid #eee",
        height: 64,
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          gap: 12,
        }}
      >
        <Link to="/" style={{ fontWeight: 800, fontSize: 20, textDecoration: "none", color: "#111" }}>
          Picsellart
        </Link>
        <div style={{ display: "flex", gap: 16 }}>
          <NavLink to="/" style={({ isActive }) => linkStyle(isActive)}>
            Home
          </NavLink>
          <NavLink to="/explore" style={({ isActive }) => linkStyle(isActive)}>
            Explore
          </NavLink>
          <NavLink to="/sell" style={({ isActive }) => linkStyle(isActive)}>
            Sell
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

function linkStyle(active) {
  return {
    textDecoration: "none",
    color: active ? "#0ea5e9" : "#111827",
    fontWeight: active ? 700 : 500,
  };
}
