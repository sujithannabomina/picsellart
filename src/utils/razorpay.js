// src/utils/razorpay.js
// Load Razorpay only once and expose a simple openCheckout + server order helper.

let razorpayPromise;

/** Dynamically load Razorpay checkout script once */
export function loadRazorpay() {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(true);
  }
  if (!razorpayPromise) {
    razorpayPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.head.appendChild(script);
    });
  }
  return razorpayPromise;
}

/**
 * Open Razorpay checkout
 * @param {Object} params
 * @param {number} params.amount Amount in paise (₹499 → 49900)
 * @param {string} params.orderId  server-generated order id
 * @param {string} [params.currency='INR']
 * @param {string} [params.name='Picsellart']
 * @param {string} [params.description]
 * @param {Object} [params.prefill] {name,email,contact}
 * @param {Object} [params.notes]
 * @param {Function} [params.onSuccess] handler(paymentData)
 * @param {Function} [params.onDismiss] handler()
 */
export async function openCheckout({
  amount,
  orderId,
  currency = "INR",
  name = "Picsellart",
  description = "Picsellart Seller Subscription",
  prefill,
  notes,
  onSuccess,
  onDismiss,
}) {
  await loadRazorpay();

  const key =
    import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY;
  if (!key) {
    throw new Error("Razorpay key missing (VITE_RAZORPAY_KEY_ID)");
  }
  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not available");
  }

  const options = {
    key,
    amount,
    currency,
    name,
    description,
    order_id: orderId,
    prefill,
    notes,
    theme: { color: "#2563ff" },
    handler: function (response) {
      onSuccess && onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        onDismiss && onDismiss();
      },
      escape: true,
      confirm_close: true,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
}

/** Calls your Vercel Function to create an order and returns { orderId, amount, currency } */
export async function createServerOrder(amountPaise) {
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Create order failed (${res.status}) ${txt}`);
  }
  return res.json(); // expected: { orderId, amount, currency }
}
