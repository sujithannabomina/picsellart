import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container navbar">
        <Link to="/" className="brand" aria-label="Picsellart home">
          <img src="/logo.png" alt="Picsellart logo" />
          <span style={{fontWeight:700}}>Picsellart</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/refund">Refund</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-actions">
          <Link className="btn btn-ghost" to="/buyer/login">Buyer Login</Link>
          <Link className="btn btn-primary" to="/seller/login">Seller Login</Link>
        </div>
      </div>
    </header>
  );
}
