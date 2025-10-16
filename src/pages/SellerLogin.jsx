// src/pages/SellerLogin.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { user, profile, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  // after login decide where to go
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    // if the pack is missing or expired, push to renew
    const expiresAt = profile?.seller?.packExpiresAt?.seconds
      ? profile.seller.packExpiresAt.seconds * 1000
      : null;
    const active = expiresAt ? Date.now() < expiresAt : false;

    if (!active) {
      navigate("/seller/renew");
    } else {
      navigate("/seller/dashboard");
    }
  }, [loading, user, profile, navigate]);

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 460 }}>
        <h1 className="page-title">Seller Login / Sign Up</h1>
        <p style={{ color: "#64748b", marginBottom: 18 }}>
          Use Google to access your seller account.
        </p>
        <button
          className="btn primary w-full"
          onClick={async () => await signInWithGoogle()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width="18" height="18" />
          Continue with Google
        </button>
      </div>
    </main>
  );
}
