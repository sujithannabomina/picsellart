// src/pages/SellerPlan.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { openRazorpay, toCustomer } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";     // keep your existing context
import { PLANS } from "../utils/plans";               // [{id, name, price, uploads, maxPrice, days}]

export default function SellerPlan() {
  const { user } = useAuth?.() || { user: null };
  const nav = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const customer = toCustomer(user);

  async function buyPlan(plan) {
    if (!user) return nav("/seller/login");
    setLoadingId(plan.id);
    try {
      await openRazorpay({
        mode: "seller_plan",
        userId: user.uid || user.id,
        planId: plan.id,
        customer,
        meta: { planName: plan.name },
      });
      // The webhook will enable the plan. We route to dashboard with a notice.
      nav("/seller/dashboard");
    } catch (e) {
      console.error(e);
      alert("Payment could not be started. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <main className="section container">
      <h1>Choose a Seller Plan</h1>
      <p className="muted">Upload limits, per-image price caps and access duration are enforced automatically.</p>

      <div className="grid" style={{ marginTop: 20 }}>
        {PLANS.map((p) => (
          <div key={p.id} className="card" style={{ gridColumn: "span 4", padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{p.name}</h3>
            <p className="muted">₹{p.price} / {p.days} days</p>
            <ul className="muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
              <li>Uploads: {p.uploads}</li>
              <li>Max per-image price: ₹{p.maxPrice}</li>
              <li>Access duration: {p.days} days</li>
            </ul>
            <button
              className="btn"
              style={{ marginTop: 12, width: "100%" }}
              onClick={() => buyPlan(p)}
              disabled={loadingId === p.id}
            >
              {loadingId === p.id ? "Starting payment…" : "Buy plan"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
