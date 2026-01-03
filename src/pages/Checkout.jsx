import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function priceFromName(name) {
  const match = name.match(/\d+/);
  const n = match ? parseInt(match[0], 10) : 1;
  return 120 + (n % 80);
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const existing = document.getElementById("razorpay-sdk");
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { fileName } = useParams();
  const decoded = decodeURIComponent(fileName || "");
  const amount = useMemo(() => priceFromName(decoded), [decoded]);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      console.warn("Missing VITE_RAZORPAY_KEY_ID in .env");
    }
  }, []);

  const payNow = async () => {
    setBusy(true);

    const ok = await loadRazorpayScript();
    if (!ok) {
      alert("Razorpay SDK failed to load. Please try again.");
      setBusy(false);
      return;
    }

    // 1) Create order on server
    const orderRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountInr: amount,
        itemId: decoded,
        buyerEmail: user?.email || "",
      }),
    });

    if (!orderRes.ok) {
      alert("Failed to create Razorpay order.");
      setBusy(false);
      return;
    }

    const orderData = await orderRes.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount, // in paise
      currency: orderData.currency,
      name: "Picsellart",
      description: `Purchase: ${decoded}`,
      order_id: orderData.orderId,
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
      },
      handler: async (response) => {
        // 2) Verify payment on server
        const verifyRes = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            itemId: decoded,
            buyerEmail: user?.email || "",
          }),
        });

        if (verifyRes.ok) {
          alert("Payment verified ✅ (Next: deliver original file)");
          navigate("/buyer-dashboard");
        } else {
          alert("Payment verification failed.");
        }
      },
      theme: { color: "#7c3aed" },
    };

    const rz = new window.Razorpay(options);
    rz.on("payment.failed", () => alert("Payment failed. Please try again."));
    rz.open();

    setBusy(false);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      <p className="text-gray-600 mt-2">
        You are purchasing: <span className="font-semibold">Street Photography</span>
      </p>

      <div className="mt-6 bg-white border rounded-2xl p-6">
        <div className="text-sm text-gray-600">File</div>
        <div className="font-semibold">{decoded}</div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl font-bold">Total: ₹{amount}</div>
          <div className="text-sm text-gray-500">Standard digital license</div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-full border bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            disabled={busy}
            onClick={payNow}
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60"
          >
            {busy ? "Starting..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </main>
  );
}
