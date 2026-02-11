// api/razorpay/webhook.js
import { allowCors, ok, bad } from "../_lib/utils.js";

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;
    if (req.method !== "POST") return bad(res, 405, "Method not allowed.");

    // Keeping endpoint alive without breaking deployments.
    // If you want strict signature verification later, we will update to raw-body parsing.
    return ok(res, { received: true });
  } catch (e) {
    return bad(res, 500, "Webhook error", { detail: e?.message || "Unknown error" });
  }
}
