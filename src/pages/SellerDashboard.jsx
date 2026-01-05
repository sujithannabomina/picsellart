// src/pages/SellerDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getPlan, PLANS } from "../utils/plans";

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function SellerDashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(auth?.currentUser || null);
  const [sellerDoc, setSellerDoc] = useState(null);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth?.onAuthStateChanged?.((u) => setUser(u));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    async function load() {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setSellerDoc(snap.exists() ? snap.data() : null);

        // If no active plan, force seller to plan screen (seller-login handles)
        const expiresAt = snap.data()?.planExpiresAt;
        if (!expiresAt || new Date(expiresAt).getTime() < Date.now()) {
          nav("/seller-login?step=plan", { replace: true });
        }
      } catch {
        setSellerDoc(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.uid, nav]);

  const plan = useMemo(() => getPlan(sellerDoc?.planId), [sellerDoc?.planId]);

  const uploadsUsed = Number(sellerDoc?.uploadsUsed || 0);
  const uploadLimit = Number(plan?.maxUploads || 0);
  const uploadsRemaining = Math.max(0, uploadLimit - uploadsUsed);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-gray-600">Loading…</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage uploads, plan, sales (next), and account settings.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTab("overview")}
            className={`px-5 py-2.5 rounded-full border font-semibold ${
              tab === "overview" ? "bg-purple-600 text-white border-purple-600" : ""
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("uploads")}
            className={`px-5 py-2.5 rounded-full border font-semibold ${
              tab === "uploads" ? "bg-purple-600 text-white border-purple-600" : ""
            }`}
          >
            Uploads
          </button>
          <button
            onClick={() => setTab("billing")}
            className={`px-5 py-2.5 rounded-full border font-semibold ${
              tab === "billing" ? "bg-purple-600 text-white border-purple-600" : ""
            }`}
          >
            Plan & Billing
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`px-5 py-2.5 rounded-full border font-semibold ${
              tab === "settings" ? "bg-purple-600 text-white border-purple-600" : ""
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Top cards */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <Card title="Seller Account">
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-semibold text-gray-900">{user?.email || "-"}</div>
          <div className="mt-4 flex gap-3">
            <Link
              to="/seller-upload"
              className="px-5 py-2.5 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Upload Photos
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-full border font-semibold hover:bg-gray-50 transition"
            >
              Support
            </Link>
          </div>
        </Card>

        <Card title="Plan Status">
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-gray-500">Active Plan</div>
            <div className="text-2xl font-bold text-gray-900">
              {plan?.name || "—"}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Valid until:{" "}
              <span className="font-semibold">
                {sellerDoc?.planExpiresAt
                  ? new Date(sellerDoc.planExpiresAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Max price per image:{" "}
            <b>₹{plan?.maxPricePerImageINR ?? "—"}</b>
          </div>
        </Card>

        <Card title="Uploads">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border p-4">
              <div className="text-sm text-gray-500">Used</div>
              <div className="text-2xl font-bold text-gray-900">{uploadsUsed}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-sm text-gray-500">Remaining</div>
              <div className="text-2xl font-bold text-gray-900">
                {uploadsRemaining}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-purple-600"
                style={{
                  width:
                    uploadLimit === 0
                      ? "0%"
                      : `${Math.min(100, (uploadsUsed / uploadLimit) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Limit: <b>{uploadLimit}</b> uploads
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs content */}
      <div className="mt-8">
        {tab === "overview" && (
          <div className="rounded-3xl border bg-white p-6">
            <div className="font-semibold text-gray-900">Overview</div>
            <div className="mt-2 text-gray-600">
              Next professional modules: Sales summary, Earnings, Payout settings, Photo
              performance (views, purchases).
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border p-4">
                <div className="text-sm text-gray-500">Sales</div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500 mt-1">Coming next</div>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-sm text-gray-500">Earnings</div>
                <div className="text-2xl font-bold text-gray-900">₹0</div>
                <div className="text-xs text-gray-500 mt-1">Coming next</div>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-sm text-gray-500">Top Photo</div>
                <div className="text-2xl font-bold text-gray-900">—</div>
                <div className="text-xs text-gray-500 mt-1">Coming next</div>
              </div>
            </div>
          </div>
        )}

        {tab === "uploads" && (
          <div className="rounded-3xl border bg-white p-6">
            <div className="font-semibold text-gray-900">Uploads</div>
            <div className="mt-2 text-gray-600">
              Upload your images and manage your catalog (edit price/title, disable, etc.).
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/seller-upload"
                className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              >
                Upload Now
              </Link>
              <Link
                to="/explore"
                className="px-6 py-2.5 rounded-full border font-semibold hover:bg-gray-50 transition"
              >
                View Marketplace
              </Link>
            </div>

            <div className="mt-6 rounded-2xl border bg-gray-50 p-5 text-sm text-gray-700">
              Your Upload module should increment <b>uploadsUsed</b> in Firestore and prevent
              uploads when remaining = 0 (this is enforced by plan).
            </div>
          </div>
        )}

        {tab === "billing" && (
          <div className="rounded-3xl border bg-white p-6">
            <div className="font-semibold text-gray-900">Plan & Billing</div>
            <div className="mt-2 text-gray-600">
              Upgrade anytime to increase upload limits.
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {PLANS.map((p) => {
                const active = p.id === sellerDoc?.planId;
                return (
                  <div key={p.id} className="rounded-3xl border p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-900">{p.name}</div>
                      {active && (
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-3xl font-bold text-gray-900">
                      ₹{p.priceINR}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {p.durationDays} days • {p.maxUploads} uploads • Max price ₹
                      {p.maxPricePerImageINR}
                    </div>
                    <div className="mt-4 text-sm text-gray-600">{p.bestFor}</div>

                    <div className="mt-6">
                      <Link
                        to={`/seller-login?step=plan&plan=${p.id}`}
                        className="block text-center px-6 py-2.5 rounded-full border font-semibold hover:bg-gray-50 transition"
                      >
                        {active ? "Manage" : "Upgrade"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="rounded-3xl border bg-white p-6">
            <div className="font-semibold text-gray-900">Settings</div>
            <div className="mt-2 text-gray-600">
              Next: payout details, profile info, support tickets.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
