// api/_lib/razorpay.js
import { bad } from "./utils.js";

function getCreds() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id) throw new Error("Missing RAZORPAY_KEY_ID env var.");
  if (!key_secret) throw new Error("Missing RAZORPAY_KEY_SECRET env var.");

  const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");
  return { key_id, key_secret, auth };
}

async function rpRequest(path, payload) {
  const { auth } = getCreds();

  const resp = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg =
      data?.error?.description ||
      data?.error?.code ||
      data?.message ||
      `Razorpay API error (${resp.status})`;
    const err = new Error(msg);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function createRazorpayOrder({ amount, currency = "INR", receipt, notes, payment_capture = 1 }) {
  return rpRequest("orders", { amount, currency, receipt, notes, payment_capture });
}

export async function createRazorpaySubscription({ plan_id, total_count = 1, customer_notify = 1, notes }) {
  return rpRequest("subscriptions", { plan_id, total_count, customer_notify, notes });
}

// This is used on frontend (public key) for Razorpay checkout
export function getPublicKey() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  if (!key_id) throw new Error("Missing RAZORPAY_KEY_ID env var.");
  return key_id;
}
