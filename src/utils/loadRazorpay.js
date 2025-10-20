// src/utils/loadRazorpay.js
// Single, safe loader + a helper to launch checkout and a tiny client for /api/createOrder

let razorpayScriptPromise = null;

/**
 * Load Razorpay Checkout script once and return window.Razorpay
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
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) resolve(window.Razorpay);
        else reject(new Error("Razorpay failed to load"));
      };
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
}

/**
 * Launch Razorpay checkout
 * @param {Object} opts
 * @param {string} opts.key           - Public key id (returned by /api/createOrder)
 * @param {string} opts.orderId       - Razorpay order id
 * @param {number} opts.amount        - amount in paise
 * @param {string} [opts.name]        - merchant / app name
 * @param {string} [opts.description] - description shown in widget
 * @param {string} [opts.image]       - logo url
 * @param {Object} [opts.prefill]     - { name, email }
 * @param {Object} [opts.notes]       - extra notes
 * @param {string} [opts.themeColor]  - hex color
 * @param {Function} [opts.handler]   - callback on success
 */
export async function launchRazorpay(opts) {
  const {
    key,
    orderId,
    amount,
    name = "Picsellart",
    description = "",
    image = "/logo.png",
    prefill = {},
    notes = {},
    themeColor = "#6C63FF",
    handler,
  } = opts || {};

  const Razorpay = await loadRazorpay();

  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key,
      order_id: orderId,
      amount,
      currency: "INR",
      name,
      description,
      image,
      notes,
      prefill,
      theme: { color: themeColor },
      handler: (response) => {
        try {
          if (typeof handler === "function") handler(response);
        } catch (_) {}
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
 * POST helper to your serverless API to create an order
 * payload example:
 *  - { mode: "buyer", amount: 49900 }  // amount in paise
 *  - { mode: "seller", plan: "starter" } // plan is server-validated
 */
export async function createOrderClient(payload) {
  const res = await fetch("/api/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.error || "Failed to create order");
  }
  return res.json(); // => { order: {...}, key: "<public-key>" }
}

async function safeJson(r) {
  try {
    return await r.json();
  } catch {
    return null;
  }
}
