// src/lib/payments.js
// Small client helpers that call your existing Vercel API routes.

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text || url}`);
  }
  return res.json();
}

/**
 * Create a Razorpay order for a seller pack.
 * Server should return: { orderId, amount, currency, key }
 */
export async function createOrder({ planId }) {
  return postJson("/api/createPackOrder", { planId });
}

/**
 * Verify payment for a seller pack after Razorpay success.
 * Expected body: { orderId, paymentId, signature }
 */
export async function verifyPackPayment({ orderId, paymentId, signature }) {
  return postJson("/api/verifyPackPayment", { orderId, paymentId, signature });
}

/**
 * (Optional) Create a Razorpay order for buying a photo.
 * Server route already exists in your repo: /api/createPhotoOrder
 */
export async function createPhotoOrder({ photoId }) {
  return postJson("/api/createPhotoOrder", { photoId });
}

/**
 * (Optional) Verify payment for a photo purchase.
 * Server route already exists: /api/verifyPhotoPayment
 */
export async function verifyPhotoPayment({ orderId, paymentId, signature }) {
  return postJson("/api/verifyPhotoPayment", { orderId, paymentId, signature });
}
