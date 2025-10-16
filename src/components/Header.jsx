import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const NavA = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 text-sm font-medium transition ${
        isActive ? "text-indigo-700" : "text-indigo-600 hover:text-indigo-800"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function Header() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const doLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Picsellart" className="h-7 w-7" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Picsellart
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavA to="/">Home</NavA>
          <NavA to="/explore">Explore</NavA>
          <NavA to="/faq">FAQ</NavA>
          <NavA to="/refund">Refund</NavA>
          <NavA to="/contact">Contact</NavA>
        </nav>

        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Link
                to="/buyer/login"
                className="rounded-xl border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              >
                Buyer Login
              </Link>
              <Link
                to="/seller/login"
                className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Seller Login
              </Link>
            </>
          )}

          {user && (
            <>
              {role === "buyer" ? (
                <Link
                  to="/buyer/dashboard"
                  className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/seller/dashboard"
                  className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={doLogout}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
