// api/razorpay/create-subscription.js
import { getRazorpay } from "../_lib/razorpay.js";
import { allowCors, ok, bad } from "../_lib/utils.js";

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;
    if (req.method !== "POST") return bad(res, 405, "Method not allowed. Use POST.");

    const body = req.body || {};
    const sellerUid = String(body.sellerUid || "").trim();
    const planId = String(body.planId || "").trim();

    if (!sellerUid) return bad(res, 400, "Missing sellerUid.");
    if (!planId) return bad(res, 400, "Missing planId (Razorpay plan id).");

    const rz = getRazorpay();

    const sub = await rz.subscriptions.create({
      plan_id: planId,
      total_count: 1,
      customer_notify: 1,
      notes: { purpose: "seller_plan", sellerUid },
    });

    return ok(res, { subscriptionId: sub.id, status: sub.status });
  } catch (e) {
    return bad(res, 500, "Subscription creation failed", { detail: e?.message || "Unknown error" });
  }
}
