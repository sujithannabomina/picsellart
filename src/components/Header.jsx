import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const active = "font-semibold text-slate-900";
const idle = "text-slate-500 hover:text-slate-700";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Picsellart" className="h-6 w-6 rounded" />
          <span className="text-lg font-semibold">Picsellart</span>
        </Link>

        <nav className="ml-6 hidden md:flex items-center gap-4">
          <NavLink to="/explore" className={({ isActive }) => (isActive ? active : idle)}>Explore</NavLink>
          <NavLink to="/faq" className={({ isActive }) => (isActive ? active : idle)}>FAQ</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? active : idle)}>Contact</NavLink>
          <NavLink to="/refund" className={({ isActive }) => (isActive ? active : idle)}>Refunds</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/buyer"
            className="rounded-full border px-4 py-1.5 text-sm border-slate-300 hover:border-slate-400"
          >
            Buyer Login
          </Link>
          <Link
            to="/seller"
            className="rounded-full border px-4 py-1.5 text-sm border-slate-300 hover:border-slate-400"
          >
            Seller Login
          </Link>
          <button
            onClick={() => nav("/explore")}
            className="rounded-full bg-blue-600 text-white px-4 py-1.5 text-sm shadow hover:bg-blue-700"
          >
            Explore
          </button>

          {user && (
            <button
              onClick={logout}
              title={user.email || user.displayName || "Logout"}
              className="ml-2 text-xs text-slate-500 hover:text-slate-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
