// src/pages/BuyerLogin.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BuyerLogin() {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/buyer/dashboard");
  }, [loading, user, navigate]);

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 460 }}>
        <h1 className="page-title">Buyer Login / Sign Up</h1>
        <p style={{ color: "#64748b", marginBottom: 18 }}>
          Use Google to continue.
        </p>
        <button
          className="btn primary w-full"
          onClick={async () => {
            await signInWithGoogle();
            navigate("/buyer/dashboard");
          }}
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
