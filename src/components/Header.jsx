import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, role, loading, signOut } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await signOut();
    nav('/');
  };

  const DashButton = () => {
    if (loading) return null;
    if (!user) {
      return (
        <>
          <Link className="btn" to="/buyer/login">Buyer Login</Link>
          <Link className="btn btn-secondary" to="/seller/login">Seller Login</Link>
        </>
      );
    }
    if (role === 'seller') {
      return (
        <>
          <Link className="btn" to="/seller/dashboard">Seller Dashboard</Link>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </>
      );
    }
    // default to buyer
    return (
      <>
        <Link className="btn" to="/buyer/dashboard">Buyer Dashboard</Link>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </>
    );
  };

  return (
    <header className="site-header">
      <div className="wrap">
        <Link to="/" className="brand">Picsellart</Link>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/refund">Refund</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="actions">
          <DashButton />
        </div>
      </div>
    </header>
  );
}
