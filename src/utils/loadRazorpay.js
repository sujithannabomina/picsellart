// src/utils/loadRazorpay.js
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

export async function openRazorpay({
  amount,                 // rupees (e.g., 300). Server will convert to paise.
  currency = "INR",
  name = "PicSellArt",
  description = "Seller Plan",
  receipt,
  customer = {},
}) {
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  // Call our unified server endpoint (Vercel /api) which will
  // either create the order directly or proxy to Cloud Function.
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, receipt, customer }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to create order: ${res.status} ${txt}`);
  }

  const { order, key_id } = await res.json();

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: key_id,
      amount: order.amount,
      currency: order.currency,
      name,
      description,
      order_id: order.id,
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error("Checkout closed")) },
      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.contact || "",
      },
      notes: { receipt: receipt || "" },
      theme: { color: "#111111" },
    });
    rzp.open();
  });
}
