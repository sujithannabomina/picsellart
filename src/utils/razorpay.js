// /src/utils/razorpay.js
export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export async function createServerOrder(payload) {
  // You already have /api/razorpay/create-photo-order in your repo.
  // It must return: { id, amount, currency, receipt, ... }
  const res = await fetch("/api/razorpay/create-photo-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function openCheckout({ keyId, order, user, onSuccess }) {
  await loadRazorpay();
  const options = {
    key: keyId,
    amount: order.amount,
    currency: order.currency || "INR",
    name: "Picsellart",
    description: "Photo Purchase",
    order_id: order.id,
    prefill: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
    handler: onSuccess,
    theme: { color: "#2563eb" },
  };
  const rz = new window.Razorpay(options);
  rz.open();
}
