import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const onBuyerLogin = () => navigate("/buyer");          // page triggers popup immediately
  const onSellerLogin = () => navigate("/seller");        // page triggers popup immediately

  const onDashboard = () => {
    if (role === "seller") navigate("/seller/dashboard");
    else navigate("/buyer/dashboard");
  };

  return (
    <header className="px-4 md:px-8 py-3 flex items-center justify-between border-b">
      <Link to="/" className="font-semibold text-lg">Picsellart</Link>

      <nav className="flex items-center gap-4">
        <Link to="/explore">Explore</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/refunds">Refunds</Link>
      </nav>

      <div className="flex items-center gap-2">
        {!user && (
          <>
            <button className="btn" onClick={onBuyerLogin}>Buyer Login</button>
            <button className="btn" onClick={onSellerLogin}>Seller Login</button>
          </>
        )}

        {user && (
          <>
            <button className="btn" onClick={onDashboard}>Dashboard</button>
            <button className="btn btn-primary" onClick={() => logout()}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
