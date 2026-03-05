// FILE PATH: src/pages/AdminDashboard.jsx
// ✅ FIXED: Fetches UPI ID from sellers collection + shows seller name

import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, getDoc, doc, updateDoc, query, where, orderBy } from "firebase/firestore";
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

  useEffect(() => {
    console.log("🎯 AdminDashboard mounted");
    console.log("User:", user?.email);
    console.log("Is Admin:", isAdmin);

    const timer = setTimeout(() => {
      setAuthChecked(true);
      console.log("✅ Auth check completed");
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isAdmin]);

  useEffect(() => {
    if (!authChecked) return;

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
      // Fetch pending sales
      const pendingQuery = query(
        collection(db, "sales"),
        where("payoutStatus", "==", "pending"),
        orderBy("soldAt", "desc")
      );
      const pendingSnap = await getDocs(pendingQuery);
      const pendingRaw = [];
      pendingSnap.forEach(d => {
        pendingRaw.push({ id: d.id, ...d.data() });
      });

      // Fetch paid sales
      const paidQuery = query(
        collection(db, "sales"),
        where("payoutStatus", "==", "paid"),
        orderBy("payoutDate", "desc")
      );
      const paidSnap = await getDocs(paidQuery);
      const paidRaw = [];
      paidSnap.forEach(d => {
        paidRaw.push({ id: d.id, ...d.data() });
      });

      // ✅ Fetch UPI IDs + names from sellers collection
      const allSales = [...pendingRaw, ...paidRaw];
      const uniqueSellerIds = [...new Set(allSales.map(s => s.sellerId).filter(Boolean))];

      const sellerUPIMap = {};
      const sellerNameMap = {};
      const sellerEmailMap = {};

      for (const sellerId of uniqueSellerIds) {
        try {
          const sellerDoc = await getDoc(doc(db, "sellers", sellerId));
          if (sellerDoc.exists()) {
            const data = sellerDoc.data();
            // Try all possible UPI field names
            sellerUPIMap[sellerId] =
              data.upiId || data.upi || data.upiID || data.UpiId || data.upid || "Not set";
            sellerNameMap[sellerId] = data.name || data.displayName || "Unknown";
            sellerEmailMap[sellerId] = data.email || "";
          } else {
            sellerUPIMap[sellerId] = "Seller not found";
            sellerNameMap[sellerId] = sellerId;
            sellerEmailMap[sellerId] = "";
          }
        } catch (e) {
          console.error("Error fetching seller:", sellerId, e);
          sellerUPIMap[sellerId] = "Error fetching";
          sellerNameMap[sellerId] = sellerId;
          sellerEmailMap[sellerId] = "";
        }
      }

      // ✅ Attach UPI + name + email to each sale
      const enrichSales = (sales) =>
        sales.map(sale => ({
          ...sale,
          sellerUPI: sellerUPIMap[sale.sellerId] || "Not set",
          sellerName: sellerNameMap[sale.sellerId] || sale.sellerId,
          sellerEmail: sellerEmailMap[sale.sellerId] || "",
        }));

      setPendingSales(enrichSales(pendingRaw));
      setPaidSales(enrichSales(paidRaw));

    } catch (err) {
      console.error("Error loading sales:", err);
      alert("Error loading data. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (sale) => {
    // ✅ Show UPI ID clearly in the prompt
    const upiDisplay = sale.sellerUPI && sale.sellerUPI !== "Not set"
      ? sale.sellerUPI
      : "⚠️ UPI NOT SET - contact seller before paying";

    const confirmed = window.confirm(
      `PAY SELLER BEFORE CLICKING OK!\n\n` +
      `Seller: ${sale.sellerName}\n` +
      `Email: ${sale.sellerEmail}\n` +
      `UPI ID: ${upiDisplay}\n` +
      `Amount: ₹${sale.sellerEarning}\n\n` +
      `Have you already sent ₹${sale.sellerEarning} to ${upiDisplay}?`
    );

    if (!confirmed) return;

    const transactionId = prompt(
      `Enter UPI Transaction ID from your payment app:\n(This is your proof of payment)`
    );
    if (!transactionId || !transactionId.trim()) {
      alert("Transaction ID is required to mark as paid.");
      return;
    }

    setProcessing(sale.id);

    try {
      const saleRef = doc(db, "sales", sale.id);

      await updateDoc(saleRef, {
        payoutStatus: "paid",
        payoutDate: new Date(),
        payoutTransactionId: transactionId.trim(),
        payoutUPI: sale.sellerUPI,
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

  if (!authChecked) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const totalPendingAmount = pendingSales.reduce((sum, s) => sum + (s.sellerEarning || 0), 0);
  const totalPaidAmount = paidSales.reduce((sum, s) => sum + (s.sellerEarning || 0), 0);
  const totalPlatformRevenue = [...pendingSales, ...paidSales].reduce((sum, s) => sum + (s.platformFee || 0), 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Manage seller payouts</p>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Pending Payouts</div>
            <div className="mt-2 text-2xl font-semibold text-yellow-600">
              ₹{totalPendingAmount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {pendingSales.length} transaction{pendingSales.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Paid Out (Total)</div>
            <div className="mt-2 text-2xl font-semibold text-green-600">
              ₹{totalPaidAmount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {paidSales.length} transaction{paidSales.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="text-sm text-slate-600">Platform Revenue</div>
            <div className="mt-2 text-2xl font-semibold text-blue-600">
              ₹{totalPlatformRevenue}
            </div>
            <div className="text-xs text-slate-500 mt-1">20% commission</div>
          </div>
        </div>

        {/* Tabs */}
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
                    const dateStr = soldDate
                      ? soldDate.toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Unknown";

                    const upiMissing = !sale.sellerUPI || sale.sellerUPI === "Not set";

                    return (
                      <tr key={sale.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm">
                          {/* ✅ Shows name + email instead of raw UID */}
                          <div className="font-medium">{sale.sellerName}</div>
                          <div className="text-xs text-slate-400">{sale.sellerEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>{sale.itemName}</div>
                          <div className="text-xs text-slate-500">{sale.itemFileName}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{dateStr}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ₹{sale.sellerEarning}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {upiMissing ? (
                            <span className="text-red-500 font-medium">⚠️ Not set</span>
                          ) : (
                            <span className="font-mono text-blue-600">{sale.sellerUPI}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {upiMissing ? (
                            <span className="text-xs text-red-400">Contact seller first</span>
                          ) : (
                            <button
                              onClick={() => markAsPaid(sale)}
                              disabled={processing === sale.id}
                              className="rounded-xl bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              {processing === sale.id ? "Processing..." : "Mark as Paid"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : paidSales.length === 0 ? (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">UPI Paid To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paidSales.map(sale => {
                  const paidDate = sale.payoutDate?.toDate?.();
                  const dateStr = paidDate
                    ? paidDate.toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown";

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{sale.sellerName}</div>
                        <div className="text-xs text-slate-400">{sale.sellerEmail}</div>
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
                        {sale.payoutUPI || sale.sellerUPI || "N/A"}
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
        )}
      </div>
    </div>
  );
}
