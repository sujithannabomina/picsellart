// /src/utils/loadRazorpay.js
// Provides loadRazorpay() and openRazorpay() named exports.
// Assumes you already create an order server-side and pass order data in.

const RZP_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; // e.g. rzp_live_******

function injectScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Razorpay SDK load failed"));
    document.head.appendChild(s);
  });
}

/**
 * Opens Razorpay Checkout
 * @param {Object} params
 * @param {number} params.amount - amount in paisa
 * @param {string} params.currency - e.g. "INR"
 * @param {string} params.order_id - Razorpay order id from your backend
 * @param {Object} params.prefill - { name, email, contact }
 * @param {Object} params.notes - optional notes
 * @returns {Promise<{razorpay_payment_id:string, razorpay_order_id:string, razorpay_signature:string}>}
 */
export async function loadRazorpay(params) {
  await injectScriptOnce("https://checkout.razorpay.com/v1/checkout.js");

  return new Promise((resolve, reject) => {
    if (!window.Razorpay) return reject(new Error("Razorpay SDK missing"));
    if (!RZP_KEY_ID) return reject(new Error("Missing VITE_RAZORPAY_KEY_ID"));

    const options = {
      key: RZP_KEY_ID,
      amount: params.amount,
      currency: params.currency ?? "INR",
      order_id: params.order_id,
      name: "Picsellart",
      description: "Seller Plan / Photo Purchase",
      prefill: params.prefill ?? {},
      notes: params.notes ?? {},
      theme: { color: "#111111" },
      modal: { ondismiss: () => reject(new Error("Payment dismissed")) },
      handler: (response) => {
        // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        resolve(response);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (err) => reject(err?.error ?? err));
    rzp.open();
  });
}

// Backward-compatible alias some parts of your code use
export const openRazorpay = loadRazorpay;
