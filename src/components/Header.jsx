// src/components/Header.jsx
import { Link, NavLink } from "react-router-dom";
import logo from "/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/faq", label: "FAQ" },
  { to: "/refund", label: "Refund" },
  { to: "/contact", label: "Contact" },
];

export default function Header(){
  return (
    <header className="w-full border-b border-slate-100 bg-white/70 backdrop-blur">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Picsellart" className="h-8 w-8 rounded-lg" />
          <span style={{fontWeight:500}}>Picsellart</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n)=>(
            <NavLink
              key={n.to}
              to={n.to}
              className={({isActive})=>
                `text-sm ${isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/buyer/login" className="btn btn--ghost">Buyer Login</Link>
          <Link to="/seller/login" className="btn">Seller Login</Link>
        </div>
      </div>
    </header>
  );
}
