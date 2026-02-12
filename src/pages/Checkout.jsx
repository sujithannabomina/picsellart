// src/pages/Checkout.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // You can control these based on your app
  const imageId = params.get("id") || "sample";
  const amountRupees = Number(params.get("amount")) || 169; // fallback

  const onPay = async () => {
    setError("");
    setBusy(true);

    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load");

      // Call your Vercel proxy API
      const resp = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountRupees,     // rupees
          currency: "INR",
          imageId,
          receipt: `img_${imageId}_${Date.now()}`,
          notes: { source: "picsellart-web" },
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || "create-order failed");

      const { keyId, orderId, amount, currency } = data;
      if (!keyId || !orderId) throw new Error("Invalid create-order response");

      const rzp = new window.Razorpay({
        key: keyId,
        amount, // paise (from backend)
        currency,
        name: "PicSellArt",
        description: "Image purchase",
        order_id: orderId,
        handler: function () {
          // Webhook will confirm payment on server.
          // Here just redirect user to Buyer Dashboard Purchases.
          navigate("/buyer-dashboard?tab=purchases");
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
        theme: { color: "#2563eb" },
      });

      rzp.open();
    } catch (e) {
      console.error(e);
      setError(e.message || "Payment failed");
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 6 }}>Checkout</h1>
      <p style={{ color: "#6b7280", marginBottom: 18 }}>
        Complete your purchase to download the full file.
      </p>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: 14,
            borderRadius: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 20,
          background: "white",
        }}
      >
        <div style={{ marginBottom: 10, color: "#6b7280", fontWeight: 600 }}>Amount</div>
        <div style={{ fontSize: 42, fontWeight: 900, marginBottom: 10 }}>₹{amountRupees}</div>

        <p style={{ color: "#6b7280", marginBottom: 18 }}>
          After payment, your download will appear in Buyer Dashboard → Purchases.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button
            onClick={onPay}
            disabled={busy}
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              border: "0",
              background: busy ? "#93c5fd" : "#2563eb",
              color: "white",
              fontWeight: 800,
              cursor: busy ? "not-allowed" : "pointer",
              minWidth: 240,
            }}
          >
            {busy ? "Processing..." : "Pay & Complete Purchase"}
          </button>

          <button
            onClick={() => navigate("/explore")}
            disabled={busy}
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              background: "#f8fafc",
              color: "#2563eb",
              fontWeight: 800,
              cursor: busy ? "not-allowed" : "pointer",
              minWidth: 240,
            }}
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
