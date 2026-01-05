// src/pages/BuyerDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function BuyerDashboard() {
  const [user, setUser] = useState(auth?.currentUser || null);
  const [tab, setTab] = useState("overview");
  const [purchases, setPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  useEffect(() => {
    const unsub = auth?.onAuthStateChanged?.((u) => setUser(u));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    async function loadPurchases() {
      if (!user?.uid) return;
      setLoadingPurchases(true);
      try {
        const qy = query(
          collection(db, "purchases"),
          where("buyerId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(qy);
        setPurchases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setPurchases([]);
      } finally {
        setLoadingPurchases(false);
      }
    }
    loadPurchases();
  }, [user?.uid]);

  const stats = useMemo(() => {
    const total = purchases.length;
    const verified = purchases.filter((p) => p.status === "verified").length;
    return { total, verified };
  }, [purchases]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage purchases, download access, and account details.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("overview")}
            className={`px-5 py-2.5 rounded-full border font-semibold ${
              tab === "overview" ? "bg-purple-600 text-white border-purple-600" : ""
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("purchases")}
            className={`px-5 py-2.5 rounded-full border font-semibold ${
              tab === "purchases" ? "bg-purple-600 text-white border-purple-600" : ""
            }`}
          >
            Purchases
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

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <Card title="Account">
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-semibold text-gray-900">{user?.email || "-"}</div>
          <div className="mt-4 flex gap-3">
            <Link
              to="/explore"
              className="px-5 py-2.5 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Explore Pictures
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-full border font-semibold hover:bg-gray-50 transition"
            >
              Support
            </Link>
          </div>
        </Card>

        <Card title="Purchase Summary">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border p-4">
              <div className="text-sm text-gray-500">Total Purchases</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="rounded-2xl border p-4">
              <div className="text-sm text-gray-500">Verified</div>
              <div className="text-2xl font-bold text-gray-900">{stats.verified}</div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Verified purchases show download access (watermark-free).
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link
              to="/refunds"
              className="block w-full text-center px-5 py-2.5 rounded-full border font-semibold hover:bg-gray-50 transition"
            >
              Refund Policy
            </Link>
            <Link
              to="/faq"
              className="block w-full text-center px-5 py-2.5 rounded-full border font-semibold hover:bg-gray-50 transition"
            >
              FAQ
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        {tab === "overview" && (
          <div className="rounded-3xl border bg-white p-6">
            <div className="font-semibold text-gray-900">Overview</div>
            <div className="mt-2 text-gray-600">
              Your latest purchases will appear under <b>Purchases</b>.
            </div>
          </div>
        )}

        {tab === "purchases" && (
          <div className="rounded-3xl border bg-white p-6">
            <div className="font-semibold text-gray-900">Purchases</div>

            {loadingPurchases ? (
              <div className="mt-4 text-gray-600">Loading…</div>
            ) : purchases.length === 0 ? (
              <div className="mt-4 text-gray-600">
                No purchases yet. Explore photos and buy to see them here.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr>
                      <th className="py-2">Photo</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="py-3 font-medium text-gray-900">
                          {p.photoName || p.photo || "-"}
                        </td>
                        <td className="py-3">
                          <span className="px-3 py-1 rounded-full border">
                            {p.status || "pending"}
                          </span>
                        </td>
                        <td className="py-3">₹{p.amountINR || p.amount || "-"}</td>
                        <td className="py-3">
                          {p.status === "verified" ? (
                            <a
                              href={p.downloadUrl || "#"}
                              className="px-4 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition inline-block"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-gray-500">Waiting verification</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="rounded-3xl border bg-white p-6">
            <div className="font-semibold text-gray-900">Settings</div>
            <div className="mt-2 text-gray-600">
              Account settings will appear here (profile, preferences, etc.).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
