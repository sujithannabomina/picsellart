// src/pages/SellerDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { PLANS } from "../utils/plans";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (alive) {
        setProfile(snap.exists() ? snap.data() : null);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [user]);

  const planInfo = useMemo(() => {
    if (!profile?.plan) return null;
    return PLANS[profile.plan] || null;
  }, [profile]);

  const uploadsUsed = profile?.usedUploads ?? 0;
  const uploadsLimit = profile?.uploadLimit ?? planInfo?.uploadLimit ?? 0;
  const priceCap = profile?.priceCap ?? planInfo?.priceCap ?? 0;

  const expired = useMemo(() => {
    const ts = profile?.planExpiresAt;
    if (!ts) return true;
    const ms = typeof ts === "number" ? ts : ts?.toMillis?.() ?? 0;
    return Date.now() > ms;
  }, [profile]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <p className="mt-3">Please sign in.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <p className="mt-3 text-slate-600">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Seller Dashboard</h1>
        {expired ? (
          <Link
            to="/seller/renew"
            className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500"
          >
            Renew Pack
          </Link>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
            Access Active
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <div className="text-sm text-slate-500">Current Plan</div>
          <div className="mt-1 text-xl font-semibold">{profile?.plan ?? "—"}</div>
          <div className="mt-2 text-sm text-slate-600">
            Max price per image: <strong>₹{priceCap || 0}</strong>
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="text-sm text-slate-500">Uploads</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="text-xl font-semibold">{uploadsUsed}</div>
            <div className="text-slate-500">/ {uploadsLimit}</div>
          </div>
          <div className="mt-3 h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-3 bg-indigo-600"
              style={{ width: `${Math.min(100, (uploadsUsed / Math.max(1, uploadsLimit)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {expired && (
        <div className="mt-6 rounded-2xl border p-5 bg-rose-50 border-rose-200 text-rose-800">
          Your access has expired. Please renew to continue uploading or editing your images.
        </div>
      )}
    </div>
  );
}
