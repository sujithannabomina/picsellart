// src/pages/SellerRenew.jsx
import { useState } from "react";
import { loadRazorpay } from "../utils/loadRazorpay";
import { createOrder, verifyPackPayment } from "../lib/payments";
import { PLAN_LIST } from "../utils/plans";

export default function SellerRenew() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");

  async function handleRenew(planId) {
    setError("");
    setLoadingPlan(planId);
    try {
      // 1) Create order on server for this plan
      const { orderId, amount, currency, key } = await createOrder({ planId });

      // 2) Ensure Razorpay SDK is loaded before using it
      const Razorpay = await loadRazorpay();

      const planName =
        PLAN_LIST.find((p) => p.id === planId)?.label || "Seller Pack";

      const rzp = new Razorpay({
        key,
        amount, // server returns paise
        currency,
        name: "Picsellart",
        description: `Renew ${planName}`,
        order_id: orderId,
        handler: async (response) => {
          // 3) Verify on server
          await verifyPackPayment({
            orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          // 4) Success → go to dashboard
          location.href = "/seller/dashboard";
        },
        theme: { color: "#635bff" },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
      });

      rzp.open();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError(e?.message || "Payment failed to start. Try again.");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", margin: "2rem 0 2.5rem" }}>
        Renew Your Seller Pack
      </h1>

      {error && (
        <div
          style={{
            margin: "0 auto 1.25rem",
            maxWidth: 720,
            background: "#fff5f5",
            border: "1px solid #ffd6d6",
            color: "#b30000",
            padding: "0.75rem 1rem",
            borderRadius: 10,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {PLAN_LIST.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 16,
              padding: "1.25rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              {p.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
              ₹{p.priceINR}
            </div>

            <ul style={{ paddingLeft: "1.1rem", color: "#333", lineHeight: 1.7 }}>
              <li>
                Upload limit: <b>{p.uploadLimit}</b> images
              </li>
              <li>
                Max price per image: <b>₹{p.maxPricePerImageINR}</b>
              </li>
              <li>Access renews your seller features.</li>
              {/* We intentionally do NOT mention days here. */}
            </ul>

            <button
              onClick={() => handleRenew(p.id)}
              disabled={loadingPlan === p.id}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                border: "1px solid #645cff",
                background:
                  loadingPlan === p.id ? "#9aa0ff" : "linear-gradient(#7367ff, #635bff)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loadingPlan === p.id ? "Processing…" : "Renew"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
