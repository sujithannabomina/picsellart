// src/lib/payments.js
// Thin client helpers that call your Vercel API routes for Razorpay flows.
// These functions return JSON from the API endpoints in `/api/*`.

async function postJSON(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * === PACK (subscription) payments ===
 * `SellerRenew.jsx` imports `createOrder`, so we keep that exact name here.
 * It proxies to your `/api/createPackOrder` route and returns { orderId, amount, currency }.
 */
export async function createOrder({ planId }) {
  // planId: "starter" | "pro" | "elite"
  return postJSON("/api/createPackOrder", { planId });
}

/** Verify a completed pack payment (server will sign/verify). */
export async function verifyPackPayment({ orderId, paymentId, signature }) {
  return postJSON("/api/verifyPackPayment", { orderId, paymentId, signature });
}

/**
 * === PHOTO purchase payments (buyer purchasing an image) ===
 * Creates a Razorpay order for a photo.
 * Expects your server route to figure out amount/beneficiary based on photoId.
 */
export async function createPhotoOrder({ photoId }) {
  return postJSON("/api/createPhotoOrder", { photoId });
}

/** Verify a completed photo payment (marks purchase, grants original download). */
export async function verifyPhotoPayment({ orderId, paymentId, signature, photoId }) {
  return postJSON("/api/verifyPhotoPayment", {
    orderId,
    paymentId,
    signature,
    photoId,
  });
}

/**
 * Securely create a Firestore Photo document + a short-lived upload token,
 * so the client cannot bypass plan caps by writing directly.
 * This calls your `/api/secureCreatePhoto`.
 */
export async function secureCreatePhoto({
  title,
  priceINR,
  tags = [],
  contentType,
}) {
  return postJSON("/api/secureCreatePhoto", {
    title,
    priceINR,
    tags,
    contentType,
  });
}

/** Get a signed URL for the original (unwatermarked) file after purchase. */
export async function getOriginalUrl({ photoId }) {
  return postJSON("/api/getOriginalUrl", { photoId });
}
