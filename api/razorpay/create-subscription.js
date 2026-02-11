// FILE PATH: api/razorpay/create-subscription.js
const { setCors, readJson, send } = require("../_lib/utils");
const { getRazorpay } = require("./_lib/razorpay");

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);
    const planId = body?.planId; // Razorpay plan_id (not your internal starter/pro/elite)
    const totalCount = Number(body?.totalCount || 1);
    const customerNotify = body?.customerNotify ? 1 : 0;

    if (!planId) return send(res, 400, { error: "Missing planId" });
    if (!Number.isFinite(totalCount) || totalCount < 1) return send(res, 400, { error: "Invalid totalCount" });

    const rzp = getRazorpay();

    const sub = await rzp.subscriptions.create({
      plan_id: planId,
      total_count: totalCount,
      customer_notify: customerNotify,
      notes: {
        purpose: "seller_plan",
      },
    });

    return send(res, 200, { subscriptionId: sub.id, status: sub.status });
  } catch (e) {
    return send(res, 500, { error: e?.message || "Subscription create failed" });
  }
};
