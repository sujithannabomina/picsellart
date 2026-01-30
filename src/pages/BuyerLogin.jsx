// src/pages/BuyerLogin.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerLogin() {
  const { googleLogin, ensureBuyerProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const nextUrl = useMemo(() => {
    const fromState = location.state?.next;
    const fromQuery = new URLSearchParams(location.search).get("next");
    return fromState || fromQuery || "/buyer-dashboard";
  }, [location]);

  const handleLogin = async () => {
    setErr("");
    setLoading(true);
    try {
      const u = await googleLogin();
      await ensureBuyerProfile(u);
      navigate(nextUrl, { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="psa-container">
      <div className="mx-auto max-w-[720px]">
        <div className="psa-card p-6 sm:p-10">
          <h1 className="psa-title">Buyer Login</h1>
          <p className="psa-subtitle mt-2">
            Sign in with Google to buy photos and access your buyer dashboard.
          </p>

          <div className="mt-6">
            <button
              className="psa-btn-primary w-full py-3"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            {err ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            <div className="mt-6 text-sm text-slate-600">
              Not a buyer?{" "}
              <Link className="psa-link" to="/seller-login">
                Seller Login
              </Link>
            </div>

            <div className="mt-2 text-sm text-slate-600">
              Back to{" "}
              <Link className="psa-link" to="/explore">
                Explore
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          By continuing, you agree to our Terms and Policies.
        </div>
      </div>
    </div>
  );
}
