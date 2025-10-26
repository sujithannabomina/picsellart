// /src/utils/loadRazorpay.js
import axios from "axios";

/**
 * Dynamically inject Razorpay script once per session.
 */
let razorpayLoaded = false;
async function ensureRazorpayScript() {
  if (razorpayLoaded) return true;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => {
      razorpayLoaded = true;
      resolve(true);
    };
    s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(s);
  });
  return true;
}

/**
 * Create an order with your serverless endpoint.
 * The endpoint should return: { id, amount, currency, receipt, ... }
 */
async function createOrder(payload) {
  const res = await axios.post("/api/razorpay/create-order", payload || {});
  return res.data;
}

/**
 * Verify payment with your server-side verify endpoint.
 * Your repo already has /api/verifyPayment.js which expects:
 * { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 */
async function verifyPayment(payload) {
  const res = await axios.post("/api/verifyPayment.js", payload);
  return res.data;
}

/**
 * Open Razorpay Checkout.
 * @param {Object} opts
 * @param {number} opts.amount Minor units (e.g., 99900 = ₹999.00) unless your create-order handles it
 * @param {string} opts.currency e.g., "INR"
 * @param {string} opts.name Merchant name
 * @param {string} opts.description Line item or plan label
 * @param {Object} opts.prefill { name, email, contact }
 * @param {Object} opts.notes Any metadata to persist in order
 * @returns {Promise<{status: 'success'|'failed', data?: any, error?: any}>}
 */
export async function openRazorpay(opts = {}) {
  await ensureRazorpayScript();

  // 1) Create order server-side (amount/currency can be set there or passed here)
  const order = await createOrder({
    amount: opts.amount,
    currency: opts.currency || "INR",
    notes: opts.notes || {}
  });

  if (!order || !order.id) {
    throw new Error("Order creation failed");
  }

  // 2) Open checkout
  const key =
    import.meta.env.VITE_RAZORPAY_KEY_ID ||
    import.meta.env.VITE_RAZORPAY_KEY; // you set both in Vercel; prefer KEY_ID

  if (!key) throw new Error("Missing Razorpay key. Set VITE_RAZORPAY_KEY_ID in env.");

  return new Promise((resolve) => {
    const rzp = new window.Razorpay({
      key,
      amount: order.amount, // in paise if INR
      currency: order.currency || "INR",
      name: opts.name || "Picsellart",
      description: opts.description || "Secure Payment",
      order_id: order.id,
      prefill: {
        name: opts.prefill?.name || "",
        email: opts.prefill?.email || "",
        contact: opts.prefill?.contact || ""
      },
      notes: opts.notes || {},
      theme: { color: "#111827" },
      handler: async (response) => {
        try {
          const result = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });
          resolve({ status: "success", data: result });
        } catch (e) {
          resolve({ status: "failed", error: e });
        }
      },
      modal: {
        ondismiss: () => resolve({ status: "failed", error: "dismissed" })
      }
    });

    rzp.open();
  });
}

/**
 * Backward-compatible export used by older code.
 * If you previously imported { toCustomer } from this file,
 * keep the symbol exported to avoid build errors.
 * Here we simply redirect to a generic "customer portal" path if you add one,
 * or no-op safely.
 */
export async function toCustomer(url = "/account/billing") {
  try {
    if (typeof window !== "undefined") window.location.assign(url);
  } catch {
    /* no-op */
  }
}
