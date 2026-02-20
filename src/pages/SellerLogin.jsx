// ═══════════════════════════════════════════════════════════════════════════
// FILE PATH: src/pages/SellerLogin.jsx
// ═══════════════════════════════════════════════════════════════════════════
// ✅ CORRECTED: Proper seller role checking and routing
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SellerLogin() {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const next = location.state?.next || "/seller-dashboard";

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setErr("");
    setLoading(true);
    
    try {
      // Login with Google
      const u = await googleLogin();
      console.log("✅ Logged in as:", u.email, "UID:", u.uid);

      // Check if user has a seller account
      const sellerRef = doc(db, "sellers", u.uid);
      const sellerSnap = await getDoc(sellerRef);

      if (!sellerSnap.exists()) {
        // New seller → Send to onboarding
        console.log("→ New seller, redirecting to onboarding");
        navigate("/seller-onboarding", { replace: true });
        return;
      }

      const sellerData = sellerSnap.data();
      console.log("→ Seller status:", sellerData.status);

      if (sellerData.status === "pending_profile") {
        // Paid but incomplete profile → Send to onboarding (profile step)
        console.log("→ Profile incomplete, redirecting to onboarding");
        navigate("/seller-onboarding", { replace: true });
        return;
      }

      if (sellerData.status === "active") {
        // Active seller → Send to dashboard
        console.log("→ Active seller, redirecting to dashboard");
        navigate(next, { replace: true });
        return;
      }

      // Unknown status → Send to onboarding
      console.log("→ Unknown status, redirecting to onboarding");
      navigate("/seller-onboarding", { replace: true });

    } catch (e) {
      console.error("❌ Seller login error:", e);
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
          Sign in with Google to access your seller account or become a seller.
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
          Want to buy photos instead?{" "}
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
    </div>
  );
}