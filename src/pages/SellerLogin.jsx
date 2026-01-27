import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function SellerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const next = location.state?.next || "/seller-dashboard";

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate(next);
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
        >
          Continue with Google
        </button>

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

      <div className="psa-container pt-6 text-center text-slate-500">
        © 2026 PicSellArt
      </div>
    </div>
  );
}
