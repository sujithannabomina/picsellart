// src/pages/SellerLogin.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="pageWrap"><p className="muted">Loading…</p></div>;

  return (
    <div className="pageWrap">
      <h2 className="pageTitle">Seller Login</h2>
      {user ? (
        <>
          <p className="muted">Signed in as <b>{user.displayName}</b></p>
          <div className="row">
            <button className="btn primary" onClick={() => navigate("/seller/subscribe")}>Start Selling</button>
            <button className="btn outline" onClick={signOut}>Sign out</button>
          </div>
        </>
      ) : (
        <button className="btn primary" onClick={signInWithGoogle}>Continue with Google</button>
      )}
    </div>
  );
}
