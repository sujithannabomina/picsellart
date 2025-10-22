// src/pages/SellerRenew.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createOrderClient, launchRazorpay } from "../utils/loadRazorpay";

const PLANS = [
  { id: "starter", name: "Starter", priceINR: 100, uploads: 25, maxPrice: 199, days: 180 },
  { id: "pro",     name: "Pro",     priceINR: 300, uploads: 30, maxPrice: 249, days: 180 },
  { id: "elite",   name: "Elite",   priceINR: 800, uploads: 50, maxPrice: 249, days: 180 },
];

export default function SellerRenew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function handleRenew(plan) {
    if (!user) {
      alert("Please login as a seller first.");
      navigate("/seller/login");
      return;
    }
    setBusy(true);
    try {
      // Create a plan order
      const order = await createOrderClient({
        amount: plan.priceINR * 100,
        currency: "INR",
        userId: user.uid,
        purchaseType: "plan",
        planId: plan.id,
      });

      await launchRazorpay({
        order,
        user,
        onSuccess: () => {
          alert("Payment successful! Your plan is active.");
          navigate("/seller/dashboard");
        },
      });
    } catch (e) {
      console.error(e);
      alert("Could not start payment. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Renew your plan</h1>
        <p className="page-desc">Keep selling without interruption. Choose a plan below.</p>

        <div className="grid grid--3" style={{ marginTop: 24 }}>
          {PLANS.map((p) => (
            <div key={p.id} className="card">
              <div className="card-body">
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{p.name}</h2>
                <div className="muted" style={{ marginBottom: 12 }}>
                  {p.uploads} uploads · Max ₹{p.maxPrice} per photo
                </div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>₹{p.priceINR}</div>
                <div className="muted" style={{ fontSize: 13 }}>Valid for {p.days} days</div>
                <button
                  className="btn btn--brand"
                  style={{ width: "100%", marginTop: 14 }}
                  onClick={() => handleRenew(p)}
                  disabled={busy}
                >
                  {busy ? "Processing…" : "Buy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-body">
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Need help?</h3>
            <p className="muted">Contact us via the <a className="link" href="/contact">contact page</a>.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
