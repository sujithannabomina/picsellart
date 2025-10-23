// src/utils/loadRazorpay.js
// Single Razorpay client for Seller Plans, Renewals and Photo purchases.
// Uses /api/razorpay/create-order and relies on your server webhook for verification.

import axios from "axios";

// ----- ENV -----
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// ----- tiny helpers -----
function invariant(cond, msg) {
  if (!cond) throw new Error(msg || "Invariant violation");
}

function toPaise(amountInRupees) {
  // We accept number or numeric string; always round to 2 decimals then convert.
  const n = Number(amountInRupees);
  const fixed = Math.round(n * 100);
  invariant(!Number.isNaN(fixed) && fixed > 0, "Invalid amount");
  return fixed;
}

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ----- API calls (browser -> Vercel function) -----
/**
 * Creates an order on the server for Razorpay checkout.
 * 
 * @param {Object} payload
 * @param {"seller_plan"|"seller_renew"|"photo"} payload.mode
 * @param {string} payload.userId
 * @param {string} [payload.planId]        // for seller_plan or seller_renew
 * @param {number|string} [payload.amount] // if you pass direct amount (₹)
 * @param {Object} [payload.meta]          // any extra metadata to store
 * @returns {Promise<{order: {id:string, amount:number, currency:string}, receipt:string}>}
 */
export async function createOrderClient(payload) {
  const url = "/api/razorpay/create-order";
  const { data } = await axios.post(url, payload, {
    headers: { "Content-Type": "application/json" },
  });
  // Expect: {order:{id,amount,currency}, receipt, keyId?}
  return data;
}

/**
 * Opens Razorpay checkout widget.
 *
 * @param {Object} opts
 * @param {Object} opts.order             // server-created Razorpay order
 * @param {Object} opts.customer          // {name,email,contact}
 * @param {Object} [opts.meta]            // notes to attach
 * @param {Function} [opts.onSuccess]     // called after handler
 * @param {Function} [opts.onDismiss]     // called if modal dismissed
 */
export async function launchRazorpay({ order, customer, meta = {}, onSuccess, onDismiss }) {
  invariant(RAZORPAY_KEY_ID || order.keyId, "VITE_RAZORPAY_KEY_ID is missing and server did not provide a key.");
  const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  invariant(ok, "Failed to load Razorpay SDK");

  const rzp = new window.Razorpay({
    key: order.keyId || RAZORPAY_KEY_ID,
    amount: order.amount,           // in paise
    currency: order.currency || "INR",
    name: "Picsellart",
    description: "Secure payment",
    order_id: order.id,
    prefill: {
      name: customer?.name || "",
      email: customer?.email || "",
      contact: customer?.contact || "",
    },
    notes: meta || {},
    theme: { color: "#6d62ff" },
    handler: function (response) {
      // We rely on server WEBHOOK to verify payment and activate entitlement.
      // Optionally, you can show a local success state:
      try {
        onSuccess && onSuccess(response);
      } catch {}
    },
    modal: {
      ondismiss: function () {
        try { onDismiss && onDismiss(); } catch {}
      }
    }
  });

  rzp.open();
}

/**
 * Convenience: creates order then launches checkout.
 * Returns {success:true} when the widget has been opened (does not guarantee payment).
 */
export async function openRazorpay({
  mode,           // 'seller_plan' | 'seller_renew' | 'photo'
  userId,
  planId,
  amount,         // rupees if you want to override (photo purchase)
  customer,       // {name,email,contact}
  meta = {},      // extra notes (e.g., photoId)
}) {
  invariant(mode && userId, "mode and userId are required");

  const payload = {
    mode,
    userId,
    planId: planId || undefined,
    amount: typeof amount !== "undefined" ? toPaise(Number(amount)) / 100 : undefined, // server may compute, we still send if present (₹)
    meta,
  };

  const { order } = await createOrderClient(payload);
  await launchRazorpay({ order, customer, meta });
  return { success: true };
}

// Optional utility for pages that need a consistent customer object
export function toCustomer(user) {
  if (!user) return {};
  return {
    name: user.displayName || user.name || "",
    email: user.email || "",
    contact: user.phoneNumber || "",
  };
}

// Expose helpers you’ll reuse
export default {
  createOrderClient,
  launchRazorpay,
  openRazorpay,
  toCustomer,
};
