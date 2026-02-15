// src/utils/razorpay.js

export async function createRazorpayOrder({ amountPaise, receipt, notes }) {
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to create order");
  return data;
}

export async function verifyRazorpayPayment(payload) {
  const res = await fetch("/api/razorpay/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Payment verification failed");
  return data;
}
