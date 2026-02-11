// FILE PATH: api/razorpay/_lib/razorpay.js
import Razorpay from "razorpay";
import { safeEnv } from "../../_lib/utils.js";

let _client;

export function getRazorpayClient() {
  if (_client) return _client;

  const key_id = safeEnv("RAZORPAY_KEY_ID");
  const key_secret = safeEnv("RAZORPAY_KEY_SECRET");

  if (!key_id) throw new Error("Missing RAZORPAY_KEY_ID");
  if (!key_secret) throw new Error("Missing RAZORPAY_KEY_SECRET");

  _client = new Razorpay({ key_id, key_secret });
  return _client;
}

export function getRazorpayKeyId() {
  return safeEnv("RAZORPAY_KEY_ID");
}

export function getWebhookSecret() {
  return safeEnv("RAZORPAY_WEBHOOK_SECRET");
}
