// src/utils/loadRazorpay.js
const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

let scriptLoaded = false;
function loadScript() {
  return new Promise((resolve, reject) => {
    if (scriptLoaded) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => { scriptLoaded = true; resolve(true); };
    s.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(s);
  });
}

/**
 * options: {
 *   mode: "seller" | "buyer",
 *   amount: number (in INR rupees),
 *   buyerEmail?: string,
 *   meta?: any (e.g., planId, sellerId),
 * }
 */
export async function openRazorpay({ mode, amount, buyerEmail, meta }) {
  if (!RZP_KEY) throw new Error("Missing VITE_RAZORPAY_KEY_ID");
  await loadScript();

  // Always POST to API (405 otherwise)
  const res = await fetch("/api/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, amount }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`createOrder failed: ${res.status} ${t}`);
  }
  const { orderId, currency } = await res.json();

  // Build checkout
  const rzp = new window.Razorpay({
    key: RZP_KEY,
    amount: Math.round(amount * 100), // paise
    currency: currency || "INR",
    name: "Picsellart",
    description: mode === "seller" ? "Seller Pack" : "Buyer Purchase",
    order_id: orderId,
    prefill: { email: buyerEmail || "" },
    notes: meta || {},
    handler: async (response) => {
      // Frontend success hook — verify on your backend if needed
      console.log("Payment success:", response);
      // Optionally call /api/verifyPayment here
      alert("Payment successful!");
      // Redirect or update Firestore subscription etc.
    },
    theme: { color: "#6A5AE0" },
    modal: { ondismiss: () => console.log("Checkout closed") },
  });

  rzp.open();
}
