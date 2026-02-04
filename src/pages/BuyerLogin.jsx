// FILE PATH: src/pages/BuyerLogin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

// Allow only safe buyer redirect targets (prevents random /refunds and weird states)
function sanitizeNext(next) {
  if (!next || typeof next !== "string") return "/buyer-dashboard";

  // Only allow internal paths
  if (!next.startsWith("/")) return "/buyer-dashboard";

  // Allow buyer flows and checkout flows only
  const allowPrefixes = ["/checkout", "/buyer-dashboard", "/explore", "/photo/", "/view/"];
  const ok = allowPrefixes.some((p) => next === p || next.startsWith(p));
  return ok ? next : "/buyer-dashboard";
}

export default function BuyerLogin() {
  const { user, booting, googleLogin, ensureBuyerProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const nextUrl = useMemo(() => {
    const fromState = location.state?.next;
    const fromQuery = new URLSearchParams(location.search).get("next");
    return sanitizeNext(fromState || fromQuery || "/buyer-dashboard");
  }, [location]);

  // If already logged in, go straight to dashboard (stable behavior)
  useEffect(() => {
    if (booting) return;
    if (user?.uid) navigate("/buyer-dashboard", { replace: true });
  }, [booting, user, navigate]);

  const handleLogin = async () => {
    setErr("");
    setLoading(true);
    try {
      const u = await googleLogin();

      // Block buyer login if this UID is a seller
      const sellerSnap = await getDoc(doc(db, "sellers", u.uid));
      if (sellerSnap.exists()) {
        const s = sellerSnap.data();
        if (s?.status === "active" || s?.status === "pending_profile") {
          throw new Error("This Google account is registered as a Seller. Please use Seller Login.");
        }
      }

      await ensureBuyerProfile(u);

      // Always land on a safe target
      navigate(nextUrl, { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Keep your UI exactly
  return (
    <div className="psa-container">
      <div className="mx-auto max-w-[720px]">
        <div className="psa-card p-6 sm:p-10">
          <h1 className="psa-title">Buyer Login</h1>
          <p className="psa-subtitle mt-2">
            Sign in with Google to buy photos and access your buyer dashboard.
          </p>

          <div className="mt-6">
            <button className="psa-btn-primary w-full py-3" onClick={handleLogin} disabled={loading || booting}>
              {booting ? "Loading..." : loading ? "Signing in..." : "Continue with Google"}
            </button>

            {err ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>
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

        <div className="mt-6 text-xs text-slate-500">By continuing, you agree to our Terms and Policies.</div>
      </div>
    </div>
  );
}
