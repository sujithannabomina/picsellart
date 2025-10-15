import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Header() {
  const { pathname } = useLocation();
  const { user, profile, logout } = useAuth();
  const nav = (to, label) => (<Link to={to} className={pathname===to?"font-semibold":""}>{label}</Link>);

  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-bold text-xl">Picsellart</Link>
        <nav className="flex gap-6">
          {nav("/", "Home")}
          {nav("/explore", "Explore")}
          {nav("/faq", "FAQ")}
          {nav("/refund", "Refund")}
          {nav("/contact", "Contact")}
        </nav>
        {!user ? (
          <div className="flex gap-3">
            <Link className="btn" to="/buyer/login">Buyer Login</Link>
            <Link className="btn btn-primary" to="/seller/login">Seller Login</Link>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link className="btn" to={profile?.role==="seller"?"/seller/dashboard":"/buyer/dashboard"}>Dashboard</Link>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
