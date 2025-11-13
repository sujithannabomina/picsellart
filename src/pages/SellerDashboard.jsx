// src/pages/SellerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DEFAULT_SELLER_LIMITS } from "../utils/plans";

const SELLERS_COLLECTION = "sellers";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // watch auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setSeller(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setSeller(user);
      try {
        const ref = doc(db, SELLERS_COLLECTION, user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          // first-time seller profile with default limits
          const initial = {
            email: user.email || "",
            planId: DEFAULT_SELLER_LIMITS.id || "starter",
            planName: DEFAULT_SELLER_LIMITS.name || "Starter",
            uploadsLimit: DEFAULT_SELLER_LIMITS.uploadsLimit || 25,
            maxPrice: DEFAULT_SELLER_LIMITS.maxPrice || 199,
            uploadsUsed: 0,
            createdAt: new Date(),
          };
          await setDoc(ref, initial, { merge: true });
          setProfile(initial);
        } else {
          setProfile(snap.data());
        }
      } catch (err) {
        console.error("Error loading seller profile", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (!seller && !loading) {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Seller Dashboard
        </h1>
        <p className="text-slate-600 mb-6">
          Please log in as a seller to manage your photos and earnings.
        </p>
        <button
          onClick={() => navigate("/seller-login")}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          Go to Seller Login
        </button>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div className="max-w-5xl mx-auto py-10">
        <p className="text-slate-600">Loading your seller dashboard…</p>
      </div>
    );
  }

  const remaining = Math.max(
    0,
    (profile.uploadsLimit || 0) - (profile.uploadsUsed || 0)
  );

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Seller Dashboard
      </h1>
      <p className="text-slate-600 mb-8">
        Logged in as <span className="font-semibold">{seller?.email}</span>
      </p>

      {/* Plan summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="p-5 rounded-2xl bg-white shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Current Plan</p>
          <p className="text-xl font-bold text-slate-900">
            {profile.planName || "Starter"}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Plan ID: {profile.planId}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Uploads</p>
          <p className="text-xl font-bold text-slate-900">
            {profile.uploadsUsed || 0} / {profile.uploadsLimit || 0}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {remaining} uploads remaining
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Max price / image</p>
          <p className="text-xl font-bold text-slate-900">
            ₹{profile.maxPrice || 199}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Upgrade plan to increase this limit.
          </p>
        </div>
      </div>

      {/* Placeholder action section (hooks into your existing upload flow) */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Upload new photos</h2>
          <p className="text-sm text-slate-200 mt-1">
            Use your seller upload page to add new images. They will
            automatically appear in Explore (once approved / uploaded).
          </p>
        </div>
        <button
          onClick={() => navigate("/seller-start")}
          className="px-5 py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 text-sm"
        >
          Go to Uploads
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;
