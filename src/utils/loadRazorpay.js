// src/utils/loadRazorpay.js

/**
 * Lightweight client helpers to:
 * 1) load Razorpay checkout script once
 * 2) create an order via our backend
 * 3) open Razorpay Checkout
 * 4) normalize a user object to a Razorpay "customer" object
 */

const RAZORPAY_SCRIPT_ID = "rzp-checkout-js";
const RZP_CDN = "https://checkout.razorpay.com/v1/checkout.js";

// -----------------------------
// 1) Load checkout script once
// -----------------------------
export async function loadRazorpay() {
  if (typeof window === "undefined") return false;

  if (window.Razorpay) return true;

  const existing = document.getElementById(RAZORPAY_SCRIPT_ID);
  if (existing) {
    // If a stale tag exists but window.Razorpay is not ready yet, wait a tick
    await new Promise((r) => setTimeout(r, 50));
    return !!window.Razorpay;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RZP_CDN;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });

  return !!window.Razorpay;
}

// -------------------------------------
// 2) Create order via our serverless API
// -------------------------------------
async function createOrder({ amount, currency = "INR", receipt, notes = {} }) {
  // amount must be in paise on server (we send paise from caller)
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, receipt, notes }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`Create order failed: ${res.status} ${msg}`);
  }
  const data = await res.json();
  if (!data?.id) throw new Error("Invalid order payload from server");
  return data; // { id, amount, currency, ... }
}

// ----------------------------------------------------------
// 3) Open Razorpay Checkout and resolve with payment payload
// ----------------------------------------------------------
export async function openRazorpay({
  // required
  amountPaise,
  description,
  customer, // { name, email, contact }
  // optional
  receipt,
  notes = {},
}) {
  const ok = await loadRazorpay();
  if (!ok || typeof window.Razorpay === "undefined") {
    throw new Error("Razorpay SDK not available");
  }

  // create order
  const order = await createOrder({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes,
  });

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) throw new Error("Missing VITE_RAZORPAY_KEY_ID");

  // Build options
  const options = {
    key,
    amount: order.amount, // paise
    currency: order.currency || "INR",
    name: "Picsellart",
    description: description || "Picsellart Payment",
    order_id: order.id,
    prefill: {
      name: customer?.name || "",
      email: customer?.email || "",
      contact: customer?.contact || "",
    },
    notes: notes || {},
    theme: { color: "#111827" },
  };

  // Return a promise that resolves/rejects on payment result
  const rzp = new window.Razorpay(options);

  return new Promise((resolve, reject) => {
    rzp.on("payment.failed", (resp) => {
      reject(
        new Error(
          resp?.error?.description ||
            resp?.error?.reason ||
            "Payment failed or cancelled"
        )
      );
    });

    rzp.on("payment.success", async (resp) => {
      try {
        // Optional: hit our verify endpoint for client-side confirmation (server is source of truth via webhooks)
        await fetch("/api/verifyPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_signature: resp.razorpay_signature,
          }),
        }).catch(() => {});
      } catch (_) {
        // swallow — webhook will still mark definitive status
      }
      resolve(resp);
    });

    rzp.open();
  });
}

// -------------------------------------------------
// 4) Normalize app user -> Razorpay "customer" data
// -------------------------------------------------
export function toCustomer(user) {
  if (!user) return { name: "", email: "", contact: "" };

  // Works for Firebase Auth user and our stored profile shape
  const name =
    user.name ||
    user.displayName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "Picsellart User";

  const email = user.email || "";
  const contact =
    user.phone ||
    user.phoneNumber ||
    (user.mobile ? String(user.mobile) : "");

  return { name, email, contact };
}
