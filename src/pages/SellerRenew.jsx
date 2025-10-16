// src/pages/SellerRenew.jsx
import { PLAN_LIST } from "../utils/plans";

async function createPackOrder(planId) {
  const res = await fetch("/api/createPackOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export default function SellerRenew() {
  const onRenew = async (plan) => {
    const order = await createPackOrder(plan.id);
    // open Razorpay or forward:
    // See note in SellerPlan.jsx. For now:
    alert(`Order created. Complete payment in the next step.`);
  };

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title" style={{ textAlign: "center" }}>
          Renew Your Seller Pack
        </h1>

        <div className="grid">
          {PLAN_LIST.map((p) => (
            <article key={p.id} className="photo-card" style={{ padding: 20 }}>
              <h3 style={{ marginTop: 0 }}>{p.label}</h3>
              <div style={{ fontSize: 28, fontWeight: 800, margin: "8px 0" }}>
                ₹{p.priceINR}
              </div>
              <ul style={{ color: "#475569", lineHeight: 1.6, paddingLeft: 18 }}>
                <li>Upload limit: {p.uploadLimit} images</li>
                <li>Max price per image: ₹{p.maxPricePerImage}</li>
              </ul>
              <button className="btn primary w-full" onClick={() => onRenew(p)}>
                Renew
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
