// src/pages/SellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { COMMISSION_RATE, getPlan } from "../utils/plans";

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-2 text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const [seller, setSeller] = useState(null);
  const [uploadsCount, setUploadsCount] = useState(0);
  const [grossEarnings, setGrossEarnings] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user) return;

      const sellerSnap = await getDoc(doc(db, "sellers", user.uid));
      if (!sellerSnap.exists()) return;
      const sellerData = sellerSnap.data();
      if (cancelled) return;
      setSeller(sellerData);

      // uploads count
      const photosSnap = await getDocs(query(collection(db, "photos"), where("sellerId", "==", user.uid)));
      if (!cancelled) setUploadsCount(photosSnap.size);

      // gross earnings from sales (optional collection)
      const salesSnap = await getDocs(query(collection(db, "sales"), where("sellerId", "==", user.uid)));
      let gross = 0;
      salesSnap.forEach((d) => (gross += Number(d.data()?.amountINR || 0)));
      if (!cancelled) setGrossEarnings(gross);
    }

    run();
    return () => (cancelled = true);
  }, [user]);

  const plan = useMemo(() => getPlan(seller?.planId), [seller?.planId]);

  const commission = Math.round(grossEarnings * COMMISSION_RATE);
  const net = grossEarnings - commission;

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Seller Dashboard</h1>
            <div className="mt-2 text-sm text-slate-600">
              Welcome, <span className="font-medium">{seller.name || user?.displayName || "Seller"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/seller/upload"
              className="rounded-2xl bg-black px-5 py-3 text-sm text-white hover:bg-slate-900"
            >
              Upload New Photo
            </Link>
            <button
              onClick={logout}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm hover:border-slate-400"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard
            label="Upload Limit"
            value={plan ? `${uploadsCount} / ${plan.maxUploads}` : `${uploadsCount}`}
            sub="Current uploads vs allowed uploads"
          />
          <StatCard
            label="Max Price Per Image"
            value={plan ? `₹${plan.maxPriceINR}` : "—"}
            sub="Pricing cap for each listing"
          />
          <StatCard
            label="Total Earnings (Net)"
            value={`₹${net}`}
            sub={`Commission: ₹${commission} (${Math.round(COMMISSION_RATE * 100)}% per sale)`}
          />
          <StatCard
            label="Payout UPI"
            value={seller.upiId ? seller.upiId : "Not set"}
            sub="Used for withdrawals/earnings"
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Account</div>
              <div className="mt-1 text-sm text-slate-600">
                Status: <span className="font-medium">{seller.status}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              AutoPay is managed in the user’s UPI app (cancel/resume there).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
