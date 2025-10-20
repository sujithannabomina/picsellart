// src/pages/SellerRenew.jsx
import React, { useState } from "react";
import { createOrderClient, launchRazorpay } from "../utils/loadRazorpay";

const PLANS = [
  { id: "starter", name: "Starter", price: 100, uploads: 25, maxPrice: 199 },
  { id: "pro",     name: "Pro",     price: 300, uploads: 30, maxPrice: 249 },
  { id: "elite",   name: "Elite",   price: 800, uploads: 50, maxPrice: 249 },
];

export default function SellerRenew() {
  const [busy, setBusy] = useState(null);

  async function handlePay(planId) {
    try {
      setBusy(planId);
      const { order, key } = await createOrderClient({ mode: "seller", plan: planId });
      await launchRazorpay({
        key,
        orderId: order.id,
        amount: order.amount,
        name: "Picsellart",
        description: `Seller Pack: ${planId}`,
      });
      // You can add a toast here; server-side will verify payment via webhook if you add one later
    } catch (e) {
      // optional toast
      console.error(e);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 42, marginBottom: 10 }}>Choose Your Seller Pack</h1>
      <p style={{ color: "#475569", marginBottom: 28 }}>Pay securely with Razorpay. Limits apply instantly.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        {PLANS.map((p) => (
          <div key={p.id} className="card" style={{ background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>{p.name}</h3>
            <div style={{ fontSize: 32, margin: "8px 0 12px" }}>₹{p.price}</div>
            <ul style={{ paddingLeft: 18, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
              <li>Upload limit: {p.uploads} images</li>
              <li>Max price per image: ₹{p.maxPrice}</li>
            </ul>
            <button onClick={() => handlePay(p.id)} disabled={busy === p.id}>
              {busy === p.id ? "Processing…" : "Pay"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
