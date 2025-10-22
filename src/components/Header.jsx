import { Link, NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img src="/logo.svg" alt="Picsellart" className="brand-logo" />
          <span className="brand-text">Picsellart</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/explore" className="nav-link">Explore</NavLink>
          <NavLink to="/faq" className="nav-link">FAQ</NavLink>
          <NavLink to="/refund" className="nav-link">Refund</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
        </nav>

        <div className="cta">
          <Link to="/buyer/login" className="btn btn-ghost">Buyer Login</Link>
          <Link to="/seller/login" className="btn btn-primary">Seller Login</Link>
        </div>
      </div>
    </header>
  )
}
