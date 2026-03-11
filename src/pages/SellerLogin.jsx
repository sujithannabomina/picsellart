// FILE PATH: src/pages/SellerLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Helmet } from "react-helmet-async";

export default function SellerLogin() {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setErr("");
    setLoading(true);

    try {
      const u = await googleLogin();
      console.log("✅ Logged in as:", u.email, "UID:", u.uid);

      const sellerRef = doc(db, "sellers", u.uid);
      const sellerSnap = await getDoc(sellerRef);

      if (!sellerSnap.exists()) {
        console.log("→ New seller, redirecting to onboarding");
        navigate("/seller-onboarding", { replace: true });
        return;
      }

      const sellerData = sellerSnap.data();
      console.log("→ Seller status:", sellerData.status);

      if (sellerData.status === "pending_profile") {
        console.log("→ Profile incomplete, redirecting to onboarding");
        navigate("/seller-onboarding", { replace: true });
        return;
      }

      if (sellerData.status === "active") {
        console.log("→ Active seller, redirecting to /seller-dashboard");
        navigate("/seller-dashboard", { replace: true });
        return;
      }

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
      {/* ✅ SEO Helmet */}
      <Helmet>
        <title>Sell Your Photos Online — Earn 80% — PicSellArt</title>
        <meta name="description" content="Join India's stock photo marketplace. Upload your photos and earn 80% of every sale. Plans from ₹100. Instant UPI payouts. No approval wait." />
        <meta name="keywords" content="sell photos online India, earn money photography India, stock photo seller India, upload photos earn money UPI" />
        <link rel="canonical" href="https://www.picsellart.com/seller-login" />
        <meta property="og:title" content="Sell Your Photos Online — Earn 80% — PicSellArt" />
        <meta property="og:description" content="Upload your photos and earn 80% of every sale. Plans from ₹100. Instant UPI payouts." />
        <meta property="og:url" content="https://www.picsellart.com/seller-login" />
      </Helmet>

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

        <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Have questions? Email us at{" "}
          <a href="mailto:admin@picsellart.com" className="text-blue-600 hover:underline">
            admin@picsellart.com
          </a>
        </div>
      </div>

      <div className="psa-container pt-10 text-center text-xs text-slate-500">
        By continuing, you agree to our Terms and Policies.
      </div>
    </div>
  );
}