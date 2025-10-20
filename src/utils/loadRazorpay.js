// src/utils/loadRazorpay.js
// Unified Razorpay client utilities.
// - loadRazorpay(): loads checkout.js once (idempotent)
// - launchRazorpay(): opens the checkout widget
// - openRazorpay(): alias to launchRazorpay for older code
// - createOrderClient(): POST helper to /api/createOrder

let razorpayScriptPromise = null;

/**
 * Load Razorpay checkout script once and return window.Razorpay
 * @returns {Promise<any>}
 */
export function loadRazorpay() {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      if (typeof document === "undefined") {
        reject(new Error("Document not available"));
        return;
      }
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener("load", () => {
          if (window.Razorpay) resolve(window.Razorpay);
          else reject(new Error("Razorpay failed to load"));
        }, { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay script")), { once: true });
        return;
      }

      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error("Razorpay failed to load")));
      s.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(s);
    });
  }
  return razorpayScriptPromise;
}

/**
 * Open Razorpay checkout.
 * @param {Object} opts
 * @param {string} opts.key           Public key id (returned by /api/createOrder)
 * @param {string} opts.orderId       Razorpay order id
 * @param {number} opts.amount        Amount in paise
 * @param {string} [opts.currency="INR"]
 * @param {string} [opts.name="Picsellart"]
 * @param {string} [opts.description=""]
 * @param {string} [opts.image="/logo.png"]
 * @param {Object} [opts.prefill]     { name, email, contact }
 * @param {Object} [opts.notes]
 * @param {string} [opts.themeColor="#6C63FF"]
 * @param {Function} [opts.handler]   Callback on success
 * @returns {Promise<any>}
 */
export async function launchRazorpay(opts = {}) {
  const {
    key,
    orderId,
    amount,
    currency = "INR",
    name = "Picsellart",
    description = "",
    image = "/logo.png",
    prefill = {},
    notes = {},
    themeColor = "#6C63FF",
    handler,
  } = opts;

  if (!key) throw new Error("launchRazorpay: 'key' is required");
  if (!orderId) throw new Error("launchRazorpay: 'orderId' is required");
  if (!amount) throw new Error("launchRazorpay: 'amount' is required");

  const Razorpay = await loadRazorpay();

  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key,
      order_id: orderId,
      amount,
      currency,
      name,
      description,
      image,
      prefill,
      notes,
      theme: { color: themeColor },
      handler: (response) => {
        try { if (typeof handler === "function") handler(response); } catch {}
        resolve(response);
      },
      modal: {
        ondismiss: () => reject(new Error("Payment closed by user")),
      },
    });
    rzp.open();
  });
}

/**
 * Backward-compat alias for code importing { openRazorpay }.
 * Signature is identical to launchRazorpay().
 */
export const openRazorpay = launchRazorpay;

/**
 * Create order by calling your serverless API (POST /api/createOrder).
 * Examples:
 *  - createOrderClient({ mode: "buyer", amount: 49900, notes: { imageId } })
 *  - createOrderClient({ mode: "seller", plan: "starter" })
 * Returns: { order, key }
 */
export async function createOrderClient(payload) {
  const res = await fetch("/api/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }
  if (!res.ok) {
    throw new Error((data && data.error) || "Failed to create order");
  }
  return data;
}

export default {
  loadRazorpay,
  launchRazorpay,
  openRazorpay,
  createOrderClient,
};
