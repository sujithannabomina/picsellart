// src/pages/BuyerLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function BuyerLogin() {
  const { googleLogin, ensureBuyerProfile } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onLogin = async () => {
    setErr("");
    setBusy(true);
    try {
      const u = await googleLogin();
      await ensureBuyerProfile(u);
      nav("/buyer/dashboard", { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Buyer Login</h1>
        <p className="mt-2 text-slate-600">
          Sign in with Google to explore and purchase.
        </p>

        {err ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <button
          onClick={onLogin}
          disabled={busy}
          className="mt-8 w-full rounded-2xl bg-black px-5 py-3 text-white hover:bg-slate-900 disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Continue with Google"}
        </button>

        <div className="mt-6 text-sm text-slate-600">
          Want to sell?{" "}
          <Link className="underline" to="/seller/login">
            Seller Login
          </Link>
        </div>
      </div>
    </div>
  );
}
