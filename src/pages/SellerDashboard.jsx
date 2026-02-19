// FILE PATH: src/pages/SellerDashboard.jsx
// ✅ COMPLETE with earnings tracking, sales history, payout management

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { COMMISSION_RATE, getPlan } from "../utils/plans";

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="text-sm text-slate-600">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${highlight ? 'text-green-600' : ''}`}>
        {value}
      </div>
      {sub ? <div className="mt-2 text-xs text-slate-500">{sub}</div> : null}
    </div>
  );
}

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const [seller, setSeller] = useState(null);
  const [uploadsCount, setUploadsCount] = useState(0);
  
  // ✅ NEW: Earnings data
  const [sales, setSales] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [paidEarnings, setPaidEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user) return;

      try {
        setLoading(true);

        // Get seller data
        const sellerSnap = await getDoc(doc(db, "sellers", user.uid));
        if (!sellerSnap.exists()) return;
        const sellerData = sellerSnap.data();
        if (cancelled) return;
        setSeller(sellerData);

        // Get uploads count
        const itemsSnap = await getDocs(
          query(collection(db, "items"), where("uploadedBy", "==", user.uid))
        );
        if (!cancelled) setUploadsCount(itemsSnap.size);

        // ✅ Get sales data
        const salesSnap = await getDocs(
          query(collection(db, "sales"), where("sellerId", "==", user.uid))
        );
        
        const salesData = [];
        let totalEarn = 0;
        let pendingEarn = 0;
        let paidEarn = 0;

        salesSnap.forEach((doc) => {
          const sale = { id: doc.id, ...doc.data() };
          salesData.push(sale);
          
          totalEarn += sale.sellerEarning || 0;
          if (sale.payoutStatus === "pending") {
            pendingEarn += sale.sellerEarning || 0;
          } else if (sale.payoutStatus === "paid") {
            paidEarn += sale.sellerEarning || 0;
          }
        });

        // Sort by newest first
        salesData.sort((a, b) => {
          const aTime = a.soldAt?.toMillis?.() || 0;
          const bTime = b.soldAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

        if (!cancelled) {
          setSales(salesData);
          setTotalEarnings(totalEarn);
          setPendingEarnings(pendingEarn);
          setPaidEarnings(paidEarn);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading seller data:", err);
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => (cancelled = true);
  }, [user]);

  const plan = useMemo(() => getPlan(seller?.planId), [seller?.planId]);

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
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

        {/* ✅ Stats Grid */}
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
            label="Total Sales"
            value={sales.length}
            sub={`${sales.length} photo${sales.length !== 1 ? 's' : ''} sold`}
          />
          <StatCard
            label="Payout UPI"
            value={seller.upiId ? seller.upiId : "Not set"}
            sub="Used for withdrawals/earnings"
          />
        </div>

        {/* ✅ Earnings Overview */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Earnings Overview</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total Earnings"
              value={`₹${totalEarnings}`}
              sub={`Platform fee: ${Math.round(COMMISSION_RATE * 100)}% per sale`}
            />
            <StatCard
              label="Pending Payout"
              value={`₹${pendingEarnings}`}
              sub="Awaiting payout to your UPI"
              highlight
            />
            <StatCard
              label="Paid Out"
              value={`₹${paidEarnings}`}
              sub="Already transferred to your UPI"
            />
          </div>
        </div>

        {/* ✅ Sales History */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Sales History</h2>
          
          {loading ? (
            <div className="rounded-2xl border border-slate-200 p-8 text-center">
              <div className="text-slate-600">Loading sales...</div>
            </div>
          ) : sales.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-8 text-center">
              <div className="text-slate-600">No sales yet. Upload photos to start earning!</div>
              <Link to="/seller/upload" className="mt-4 inline-block psa-btn-primary">
                Upload Photo
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Photo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Sale Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Your Earning</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Platform Fee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sales.map((sale) => {
                      const saleDate = sale.soldAt?.toDate?.();
                      const dateStr = saleDate 
                        ? saleDate.toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : 'Unknown';

                      return (
                        <tr key={sale.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm">
                            <div className="font-medium text-slate-900">{sale.itemName}</div>
                            <div className="text-xs text-slate-500">{sale.itemFileName}</div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            ₹{sale.salePrice}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">
                            ₹{sale.sellerEarning}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            ₹{sale.platformFee}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {dateStr}
                          </td>
                          <td className="px-4 py-3">
                            {sale.payoutStatus === "pending" && (
                              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                                Pending
                              </span>
                            )}
                            {sale.payoutStatus === "paid" && (
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Paid
                              </span>
                            )}
                            {sale.payoutStatus === "processing" && (
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                Processing
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Payout Information */}
        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Payout Information</div>
              <div className="mt-1 text-sm text-slate-600">
                Payouts are processed within 7 business days to your UPI ID: <span className="font-medium">{seller.upiId || "Not set"}</span>
              </div>
            </div>
            {pendingEarnings > 0 && (
              <div className="text-sm">
                <div className="rounded-xl bg-green-50 px-4 py-3 text-green-700 border border-green-200">
                  <div className="font-medium">Next payout: ₹{pendingEarnings}</div>
                  <div className="text-xs mt-1">Processing within 7 days</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Account</div>
              <div className="mt-1 text-sm text-slate-600">
                Status: <span className="font-medium">{seller.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}