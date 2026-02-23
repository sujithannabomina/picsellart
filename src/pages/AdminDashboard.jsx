// FILE PATH: src/pages/AdminDashboard.jsx
// ✅ FIXED: Waits for auth to load before redirecting

import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAILS = ["jithbomina@gmail.com"];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [pendingSales, setPendingSales] = useState([]);
  const [paidSales, setPaidSales] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [authChecked, setAuthChecked] = useState(false);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // ✅ FIX: Wait for auth to load before checking
  useEffect(() => {
    console.log("🎯 AdminDashboard mounted");
    console.log("User:", user?.email);
    console.log("Is Admin:", isAdmin);

    // Wait a bit for auth to initialize
    const timer = setTimeout(() => {
      setAuthChecked(true);
      console.log("✅ Auth check completed");
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isAdmin]);

  // ✅ Only redirect after auth is checked
  useEffect(() => {
    if (!authChecked) return; // Don't do anything until auth is checked

    if (!user) {
      console.log("❌ No user after auth check, redirecting");
      navigate("/");
      return;
    }

    if (!isAdmin) {
      console.log("❌ Not admin, redirecting");
      alert("Access denied. Admin only.");
      navigate("/");
      return;
    }

    console.log("✅ Admin verified, loading sales");
    loadSales();
  }, [authChecked, user, isAdmin, navigate]);

  const loadSales = async () => {
    setLoading(true);
    try {
      const pendingQuery = query(
        collection(db, "sales"),
        where("payoutStatus", "==", "pending"),
        orderBy("soldAt", "desc")
      );
      const pendingSnap = await getDocs(pendingQuery);
      const pending = [];
      pendingSnap.forEach(doc => {
        pending.push({ id: doc.id, ...doc.data() });
      });

      const paidQuery = query(
        collection(db, "sales"),
        where("payoutStatus", "==", "paid"),
        orderBy("payoutDate", "desc")
      );
      const paidSnap = await getDocs(paidQuery);
      const paid = [];
      paidSnap.forEach(doc => {
        paid.push({ id: doc.id, ...doc.data() });
      });

      setPendingSales(pending);
      setPaidSales(paid);
    } catch (err) {
      console.error("Error loading sales:", err);
      alert("Error loading data. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (sale) => {
    const upiId = prompt(`Confirm UPI ID for seller:\n\nExpected: ${sale.sellerUPI || "Not set"}\n\nEnter UPI ID where you sent payment:`);
    
    if (!upiId) return;

    const transactionId = prompt("Enter UPI Transaction ID (from your payment app):");
    if (!transactionId) return;

    if (!confirm(`Mark ₹${sale.sellerEarning} as PAID to seller?\n\nUPI: ${upiId}\nTransaction: ${transactionId}`)) {
      return;
    }

    setProcessing(sale.id);
    
    try {
      const saleRef = doc(db, "sales", sale.id);
      const sellerRef = doc(db, "sellers", sale.sellerId);

      await updateDoc(saleRef, {
        payoutStatus: "paid",
        payoutDate: new Date(),
        payoutTransactionId: transactionId,
        payoutUPI: upiId,
      });

      await updateDoc(sellerRef, {
        pendingEarnings: sale.sellerEarning * -1,
      });

      alert("✅ Payout marked as paid!");
      loadSales();
    } catch (err) {
      console.error("Error marking as paid:", err);
      alert("Failed to update. Check console.");
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Show loading while auth is being checked
  if (!authChecked) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  // ✅ Only return null AFTER auth is checked
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Manage seller payouts</p>
          </div>
          <button onClick={logout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Pending Payouts</div>
            <div className="mt-2 text-2xl font-semibold text-yellow-600">
              ₹{pendingSales.reduce((sum, s) => sum + (s.sellerEarning || 0), 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {pendingSales.length} transaction{pendingSales.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Paid Out (Total)</div>
            <div className="mt-2 text-2xl font-semibold text-green-600">
              ₹{paidSales.reduce((sum, s) => sum + (s.sellerEarning || 0), 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {paidSales.length} transaction{paidSales.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Platform Revenue</div>
            <div className="mt-2 text-2xl font-semibold text-blue-600">
              ₹{[...pendingSales, ...paidSales].reduce((sum, s) => sum + (s.platformFee || 0), 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              20% commission
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "pending"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600"
            }`}
          >
            Pending ({pendingSales.length})
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "paid"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600"
            }`}
          >
            Paid ({paidSales.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-600">Loading...</div>
        ) : activeTab === "pending" ? (
          pendingSales.length === 0 ? (
            <div className="text-center py-10 text-slate-600">No pending payouts</div>
          ) : (
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Seller</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Sale Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Amount to Pay</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">UPI ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pendingSales.map(sale => {
                    const soldDate = sale.soldAt?.toDate?.();
                    const dateStr = soldDate?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) || 'Unknown';

                    return (
                      <tr key={sale.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">{sale.sellerId}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>{sale.itemName}</div>
                          <div className="text-xs text-slate-500">{sale.itemFileName}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{dateStr}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ₹{sale.sellerEarning}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-blue-600">
                          {sale.sellerUPI || "Not set"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => markAsPaid(sale)}
                            disabled={processing === sale.id}
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {processing === sale.id ? "Processing..." : "Mark as Paid"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          paidSales.length === 0 ? (
            <div className="text-center py-10 text-slate-600">No paid payouts yet</div>
          ) : (
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Seller</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Paid Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Amount Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paidSales.map(sale => {
                    const paidDate = sale.payoutDate?.toDate?.();
                    const dateStr = paidDate?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) || 'Unknown';

                    return (
                      <tr key={sale.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">{sale.sellerId}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>{sale.itemName}</div>
                          <div className="text-xs text-slate-500">{sale.itemFileName}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{dateStr}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ₹{sale.sellerEarning}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">
                          {sale.payoutTransactionId || "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
