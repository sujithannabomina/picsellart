// src/utils/loadRazorpay.js
// Zero-axios version (uses fetch). Works in browsers and Vercel.
// Exports: loadRazorpayScript, createOrderClient, launchRazorpay

const RZP_SCRIPT_ID = "rzp-sdk";

/** Dynamically inject Razorpay script if not present. */
export function loadRazorpayScript(src = "https://checkout.razorpay.com/v1/checkout.js") {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("window unavailable"));
    if (document.getElementById(RZP_SCRIPT_ID)) return resolve(true);

    const s = document.createElement("script");
    s.id = RZP_SCRIPT_ID;
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Failed loading Razorpay SDK"));
    document.head.appendChild(s);
  });
}

/** Create an order via our API route. */
export async function createOrderClient({ amount, planId, mode = "seller", notes = {} }) {
  // amount in INR rupees -> server expects paise
  const body = { amount, planId, mode, notes };
  const res = await fetch("/api/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`createOrder failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  // Expecting { orderId, amount, currency, key }
  if (!data?.orderId || !data?.key) throw new Error("Invalid order response");
  return data;
}

/** Open Razorpay Checkout and return the payment payload (or throw on failure). */
export async function launchRazorpay({
  order,
  onSuccess,
  onDismiss,
  prefill,
  themeColor = "#6d5afc",
  description = "",
  name = "Picsellart",
  image = "/logo.svg",
}) {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    /* global Razorpay */
    if (typeof window.Razorpay === "undefined") {
      reject(new Error("Razorpay SDK not available"));
      return;
    }

    const options = {
      key: order.key, // publishable key returned by API
      amount: order.amount, // in paise
      currency: order.currency || "INR",
      name,
      description,
      image,
      order_id: order.orderId,
      prefill: prefill || {},
      theme: { color: themeColor },
      handler: async function (response) {
        try {
          // Optional: verify on server
          const verifyRes = await fetch("/api/verifyPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyJson = await verifyRes.json().catch(() => ({}));
          if (!verifyRes.ok || verifyJson?.status !== "ok") {
            throw new Error("Server verification failed");
          }

          onSuccess && onSuccess({ ...response, orderId: order.orderId });
          resolve({ ...response, verified: true });
        } catch (e) {
          reject(e);
        }
      },
      modal: {
        ondismiss: function () {
          onDismiss && onDismiss();
          reject(new Error("Payment dismissed"));
        },
      },
      notes: order.notes || {},
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}
