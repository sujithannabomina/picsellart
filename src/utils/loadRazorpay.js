// src/utils/loadRazorpay.js
// Production-safe Razorpay launcher with backward-compat exports.
// - Preferred export: openRazorpay()
// - Backward-compat:  loadRazorpay (alias of openRazorpay)
// - Utility:          toCustomer(user) -> { name, email, contact }

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Prevent duplicate <script> injection during hot reload or SPA nav
    if (typeof window !== "undefined" && document.querySelector(`script[src="${src}"]`)) {
      return resolve(true);
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = (e) => reject(new Error(`Failed to load ${src}: ${e?.message || e}`));
    document.body.appendChild(s);
  });
}

/**
 * Normalize any user/auth object into Razorpay prefill format.
 * Accepts Firebase user or your app's user object.
 */
export function toCustomer(user) {
  if (!user) return { name: "", email: "", contact: "" };

  // Try common shapes (Firebase Auth, your profile, etc.)
  const name =
    user.displayName ||
    user.name ||
    (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "") ||
    "";

  const email = user.email || user.mail || "";

  // Contact can be a string or nested field in your app
  const contact =
    user.phoneNumber ||
    user.contact ||
    (user.profile && user.profile.phone) ||
    "";

  return { name, email, contact };
}

/**
 * Open Razorpay Checkout.
 * @param {Object} opts
 * @param {number|string} opts.amount - Amount in INR (rupees). Will convert to paise on server.
 * @param {string} [opts.currency="INR"]
 * @param {string} [opts.name="PicSellArt"]
 * @param {string} [opts.description="Seller Plan"]
 * @param {string} [opts.receipt] - Pass a custom receipt id if you want
 * @param {Object} [opts.customer] - { name, email, contact }
 * @returns {Promise<Object>} - Razorpay handler response (razorpay_payment_id, etc.)
 */
export async function openRazorpay({
  amount,
  currency = "INR",
  name = "PicSellArt",
  description = "Seller Plan",
  receipt,
  customer = {},
}) {
  if (!amount || isNaN(amount)) {
    throw new Error("openRazorpay: 'amount' (in rupees) is required and must be a number.");
  }

  // 1) Ensure checkout script is present
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  // 2) Ask our server to create an Order (proxy to Cloud Function or direct Razorpay, per your setup)
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, receipt, customer }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to create order: HTTP ${res.status} ${txt}`);
  }

  const { order, key_id } = await res.json();
  if (!order?.id || !key_id) {
    throw new Error("Invalid server response: missing order.id or key_id");
  }

  // 3) Open checkout
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: key_id,
      amount: order.amount,     // in paise
      currency: order.currency, // "INR"
      name,
      description,
      order_id: order.id,
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Checkout closed by user")),
      },
      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.contact || "",
      },
      notes: {
        receipt: receipt || "",
      },
      theme: { color: "#111111" },
    });

    rzp.on("payment.failed", (resp) => {
      // Give a clear, actionable error
      reject(
        new Error(
          `Payment failed: ${resp?.error?.description || resp?.error?.reason || "Unknown error"}`
        )
      );
    });

    rzp.open();
  });
}

// --- Backward compatibility exports ---
// Some pages import { loadRazorpay } or { toCustomer }.
// We keep both names available to avoid touching page code.
export const loadRazorpay = openRazorpay;

// Allow default import patterns like: import loadRazorpay from "../utils/loadRazorpay";
export default openRazorpay;
