// src/utils/loadRazorpay.js
// ----------------------------------------------------
// Utility to handle Razorpay checkout and order creation
// ----------------------------------------------------

import axios from "axios";

/**
 * Dynamically load the Razorpay checkout script.
 * Returns a promise that resolves when the SDK is loaded.
 */
export async function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Create an order on your backend (Vercel serverless or Firebase Functions).
 * Expects your backend endpoint at /api/createOrder or similar.
 * Returns { id, amount, currency } for Razorpay checkout.
 */
export async function createOrderClient({ amount, currency, planId, userId }) {
  try {
    const res = await axios.post("/api/createOrder", {
      amount,
      currency,
      planId,
      userId,
    });
    return res.data;
  } catch (err) {
    console.error("createOrderClient error:", err);
    throw new Error("Order creation failed");
  }
}

/**
 * Launch Razorpay checkout widget in browser.
 * Accepts options and a callback for successful payment.
 */
export async function launchRazorpay({ order, user, onSuccess }) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay SDK failed to load. Please check your internet connection.");
    return;
  }

  if (!window.Razorpay) {
    alert("Razorpay SDK not found in window scope.");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // your public key from Razorpay dashboard
    amount: order.amount,
    currency: order.currency,
    name: "Picsellart",
    description: "Plan Purchase",
    order_id: order.id,
    handler: async function (response) {
      try {
        // verify signature on your backend
        const verifyRes = await axios.post("/api/verifyPayment", {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          userId: user?.uid,
          planId: order.planId,
        });
        if (verifyRes.data.success) {
          onSuccess?.(verifyRes.data);
        } else {
          alert("Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        alert("Verification failed. Please contact support.");
      }
    },
    prefill: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
    theme: { color: "#2563eb" },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

/**
 * Optional helper to verify webhook signature from Razorpay
 * (only runs on server in /api/verifyWebhook.js, not in browser)
 */
export function verifyWebhookSignature(body, signature, secret) {
  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(body));
  const digest = shasum.digest("hex");
  return digest === signature;
}
