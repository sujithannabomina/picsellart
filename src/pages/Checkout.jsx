// FILE: src/pages/Checkout.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { openRazorpayCheckout } from "../lib/razorpay.js";
import { doc, serverTimestamp, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { formatINR } from "../utils/plans.js";

function useQueryString() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Checkout() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useQueryString();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);

  // item is passed from Explore / View
  const item =
    loc.state?.item || {
      type: qs.get("type") || "",
      id: qs.get("id") || "",
      title: qs.get("title") || "",
      priceINR: Number(qs.get("priceINR") || 0),
      sellerId: qs.get("sellerId") || null,
      downloadUrl: qs.get("downloadUrl") || "",
    };

  const valid = item && item.type && item.id && item.priceINR > 0;

  async function payNow() {
    if (!user) {
      nav("/buyer-login", { state: { returnTo: loc.pathname + loc.search } });
      return;
    }
    if (!valid) return alert("Invalid item");

    setPaying(true);
    try {
      const resp = await fetch(`/api/razorpay?action=createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: item.priceINR * 100,
          currency: "INR",
          receipt: `buy_${user.uid}_${Date.now()}`,
          notes: { buyerId: user.uid, itemId: item.id, type: item.type, sellerId: item.sellerId || "" },
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error ? JSON.stringify(data.error) : "Order create failed");
      const order = data.order;

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Missing VITE_RAZORPAY_KEY_ID");

      const payRes = await openRazorpayCheckout({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "PicSellart",
        description: item.title || "Image purchase",
        order_id: order.id,
        prefill: { email: user.email || "" },
        notes: { itemId: item.id, type: item.type, sellerId: item.sellerId || "" },
        theme: { color: "#7c3aed" },
      });

      const v = await fetch(`/api/razorpay?action=verifyPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payRes),
      });
      const vData = await v.json();
      if (!v.ok || !vData.verified) throw new Error("Payment verification failed");

      // Save purchase record
      const pRef = doc(collection(db, "purchases"));
      await setDoc(pRef, {
        buyerId: user.uid,
        sellerId: item.type === "seller" ? item.sellerId : null,
        itemType: item.type,
        itemId: item.id,
        title: item.title,
        amountINR: item.priceINR,
        currency: "INR",
        downloadUrl: item.downloadUrl || "",
        paymentId: payRes.razorpay_payment_id,
        orderId: payRes.razorpay_order_id,
        status: "paid",
        createdAt: serverTimestamp(),
      });

      alert("Payment successful!");
      nav("/buyer-dashboard");
    } catch (e) {
      alert(e.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 18px 60px" }}>
      <h1 style={{ fontSize: 34, margin: 0, fontWeight: 900, color: "#111" }}>Checkout</h1>
      <p style={{ color: "#555", marginTop: 10, lineHeight: 1.6 }}>
        Secure payment via Razorpay. After successful payment, the purchase appears in Buyer Dashboard.
      </p>

      <div style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 18, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
        {!valid ? (
          <div style={{ color: "#b00020", fontWeight: 900 }}>Invalid item. Please go back and select an image again.</div>
        ) : (
          <>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#111" }}>{item.title}</div>
            <div style={{ marginTop: 8, color: "#666" }}>
              Type: <b>{item.type}</b>
            </div>
            <div style={{ marginTop: 8, fontWeight: 900, fontSize: 20 }}>{formatINR(item.priceINR)}</div>

            <button
              onClick={payNow}
              disabled={paying}
              style={{ marginTop: 14, background: "#7c3aed", color: "#fff", border: "none", padding: "12px 16px", borderRadius: 12, fontWeight: 900, cursor: paying ? "not-allowed" : "pointer", opacity: paying ? 0.7 : 1 }}
            >
              {paying ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
