// src/pages/SellerLogin.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SellerLogin() {
  const { googleLogin, getSellerDoc } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const next = location.state?.next || "/seller-dashboard";

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      const u = await googleLogin();

      // Decide correct next page for seller
      const seller = await getSellerDoc(u.uid);

      if (!seller) {
        // New seller -> go to onboarding (plan + profile)
        navigate("/seller-onboarding", { replace: true });
        return;
      }

      if (seller.status === "active") {
        navigate(next, { replace: true });
        return;
      }

      // pending_profile or anything else -> onboarding
      navigate("/seller-onboarding", { replace: true });
    } catch (e) {
      setErr(e?.message || "Seller login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="psa-container py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Seller Login</h1>
        <p className="mt-2 text-slate-600">
          Sign in with Google to access your seller dashboard.
        </p>

        <button
          className="psa-btn-primary mt-6 w-full"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {err ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-5 text-sm text-slate-600">
          Not a seller?{" "}
          <Link className="text-blue-700 hover:underline" to="/buyer-login">
            Buyer Login
          </Link>
        </div>

        <div className="mt-2 text-sm">
          <Link className="text-blue-700 hover:underline" to="/explore">
            Back to Explore
          </Link>
        </div>
      </div>

      <div className="psa-container pt-10 text-center text-xs text-slate-500">
        By continuing, you agree to our Terms and Policies.
      </div>

      {/* Removed the red-marked © line as requested */}
    </div>
  );
}
