import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SellerLogin() {
  const { loginAsSeller, safeNextPath } = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const next = safeNextPath(sp.get("next")) || "/seller-dashboard";

  const onLogin = async () => {
    setErr("");
    setBusy(true);
    try {
      await loginAsSeller();
      nav(next, { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl font-semibold">Seller Login</h1>
      <p className="mt-2 text-black/70">
        Login to manage your plan, upload images within limits, and track your sales.
      </p>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={onLogin}
          disabled={busy}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow hover:opacity-95 disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Continue with Google"}
        </button>

        {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
      </div>
    </div>
  );
}
