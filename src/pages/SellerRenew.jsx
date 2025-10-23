// src/pages/SellerRenew.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { openRazorpay, toCustomer } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";
import { PLANS } from "../utils/plans";

export default function SellerRenew() {
  const { user } = useAuth?.() || { user: null };
  const nav = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const customer = toCustomer(user);

  async function renew(plan) {
    if (!user) return nav("/seller/login");
    setLoadingId(plan.id);
    try {
      await openRazorpay({
        mode: "seller_renew",
        userId: user.uid || user.id,
        planId: plan.id,
        customer,
        meta: { planName: plan.name, renew: true },
      });
      nav("/seller/dashboard");
    } catch (e) {
      console.error(e);
      alert("Could not start renewal payment. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <main className="section container">
      <h1>Renew your seller access</h1>
      <p className="muted">Renew extends your remaining access by the plan duration (e.g., +180 days).</p>

      <div className="grid" style={{ marginTop: 20 }}>
        {PLANS.map((p) => (
          <div key={p.id} className="card" style={{ gridColumn: "span 4", padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{p.name}</h3>
            <p className="muted">₹{p.price} / {p.days} days</p>
            <button
              className="btn"
              style={{ marginTop: 12, width: "100%" }}
              onClick={() => renew(p)}
              disabled={loadingId === p.id}
            >
              {loadingId === p.id ? "Starting…" : "Renew"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
