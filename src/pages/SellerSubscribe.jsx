// src/pages/SellerSubscribe.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, serverTs } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  loadRazorpay,
  openCheckout,
  createServerOrder,
} from "../utils/razorpay";

const SUBSCRIPTION_PRICE_INR = 499;
const toPaise = (inr) => Math.round(Number(inr) * 100);

export default function SellerSubscribe() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function startCheckout() {
    setErr("");
    setBusy(true);
    try {
      await loadRazorpay();

      const amountPaise = toPaise(SUBSCRIPTION_PRICE_INR);

      // 1) Create order on server
      const { orderId, amount, currency } = await createServerOrder(amountPaise);

      // 2) Checkout
      await openCheckout({
        amount,
        orderId,
        currency,
        description: "Seller plan – 180 days access",
        notes: { plan: "seller_basic", days: 180 },
        onSuccess: async (payment) => {
          // 3) Save subscription record
          const id = payment.razorpay_payment_id || orderId;
          await setDoc(doc(db, "subscriptions", id), {
            plan: "seller_basic",
            priceInr: SUBSCRIPTION_PRICE_INR,
            orderId: payment.razorpay_order_id || orderId,
            paymentId: payment.razorpay_payment_id || null,
            gateway: "razorpay",
            status: "paid",
            createdAt: serverTs(),
          });

          // 4) Redirect
          nav("/seller/onboarding", { replace: true });
        },
        onDismiss: () => setBusy(false),
      });
    } catch (e) {
      console.error(e);
      setErr(e.message || "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="container page">
        <h2>Become a Seller</h2>
        <p>
          Subscribe to unlock uploads, pricing, dashboard, and payouts. Access
          is enabled for <strong>180 days</strong>.
        </p>

        <div className="mt-4" style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div className="badge">Plan</div>
          <strong>Seller Basic</strong>
          <div className="badge">Price</div>
          <strong>₹{SUBSCRIPTION_PRICE_INR}</strong>
          <div className="badge">Duration</div>
          <strong>180 days</strong>
        </div>

        {err && <p style={{ color: "#e11d48" }} className="mt-4">{err}</p>}

        <button
          className="primary btn mt-4"
          onClick={startCheckout}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? "Processing…" : "Pay & Start Selling"}
        </button>

        <p className="muted mt-2">Secure payments by Razorpay • Instant activation</p>
      </div>
    </main>
  );
}
