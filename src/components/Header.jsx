import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, role, logout, loginAs } = useAuth();
  const nav = useNavigate();

  const goBuyer = async () => {
    if (!user) await loginAs("buyer");
    nav("/explore");
  };
  const goSeller = async () => {
    if (!user || role !== "seller") await loginAs("seller");
    nav("/seller/dashboard");
  };

  return (
    <header className="hdr">
      <Link className="brand" to="/">Picsellart</Link>
      <nav>
        <Link to="/explore" className="lnk">Explore</Link>
        <Link to="/faq" className="lnk">FAQ</Link>
        <Link to="/contact" className="lnk">Contact</Link>
        <Link to="/refunds" className="lnk">Refunds</Link>
      </nav>
      <div className="act">
        {!user && (
          <>
            <button className="pill" onClick={goBuyer}>Buyer Login</button>
            <button className="pill" onClick={goSeller}>Seller Login</button>
            <Link className="pill blue" to="/explore">Explore</Link>
          </>
        )}
        {user && role === "buyer" && (
          <>
            <Link className="pill" to="/buyer/dashboard">Dashboard</Link>
            <button className="pill dark" onClick={async()=>{await logout(); nav("/");}}>Logout</button>
          </>
        )}
        {user && role === "seller" && (
          <>
            <Link className="pill" to="/seller/dashboard">Dashboard</Link>
            <button className="pill dark" onClick={async()=>{await logout(); nav("/");}}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
