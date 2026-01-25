import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SiteHeader from "../components/SiteHeader";

function Field({ label, type = "text", value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-black">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none ring-0 focus:border-violet-300"
      />
    </label>
  );
}

export default function BuyerLogin() {
  const nav = useNavigate();
  const location = useLocation();
  const { googleLogin, ensureBuyerProfile } = useAuth();

  const nextPath = useMemo(() => {
    const p = new URLSearchParams(location.search).get("next");
    return p && p.startsWith("/") ? p : "/buyer-dashboard";
  }, [location.search]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Optional fields (only used if you want to store them in buyer profile)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleGoogle() {
    setErr("");
    setLoading(true);
    try {
      const u = await googleLogin();
      // create / update buyer profile doc
      await ensureBuyerProfile(u, { name, phone });
      nav(nextPath, { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <h1 className="text-3xl font-bold tracking-tight text-black">Buyer Login</h1>
            <p className="mt-2 text-sm text-black/60">
              Login to purchase images and download watermark-free files after payment verification.
            </p>

            <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="grid gap-4">
                <Field
                  label="Name (optional)"
                  value={name}
                  onChange={setName}
                  placeholder="Your name"
                  autoComplete="name"
                />
                <Field
                  label="Phone (optional)"
                  value={phone}
                  onChange={setPhone}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                />

                {err ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                ) : null}

                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Continue with Google"}
                </button>

                <div className="text-xs text-black/50">
                  By continuing, you agree to our{" "}
                  <Link className="text-violet-700 hover:underline" to="/policy">
                    policies
                  </Link>
                  .
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link className="rounded-full border border-black/10 bg-white px-4 py-2 hover:bg-black/[0.02]" to="/explore">
                Back to Explore
              </Link>
              <Link className="rounded-full border border-black/10 bg-white px-4 py-2 hover:bg-black/[0.02]" to="/contact">
                Contact
              </Link>
              <Link className="rounded-full border border-black/10 bg-white px-4 py-2 hover:bg-black/[0.02]" to="/faq">
                FAQ
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black">What happens after login</div>
              <ul className="mt-3 space-y-2 text-sm text-black/70">
                <li className="flex gap-2">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-violet-600" />
                  Browse previews with watermark protection.
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-violet-600" />
                  Pay securely via checkout.
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-2 w-2 rounded-full bg-violet-600" />
                  Download watermark-free files from your Buyer Dashboard.
                </li>
              </ul>

              <div className="mt-5 rounded-2xl bg-black/[0.03] p-4 text-xs text-black/60">
                Tip: If you clicked “Buy” from Explore, you’ll return to the checkout automatically after login.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
