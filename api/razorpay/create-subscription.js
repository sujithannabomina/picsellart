// FILE PATH: api/razorpay/create-subscription.js
import { bad, ok, onlyPost } from "../_lib/utils.js";
import { verifyFirebaseToken, getDb } from "../_lib/firebaseAdmin.js";
import { getRazorpayClient } from "./_lib/razorpay.js";

export default async function handler(req, res) {
  try {
    if (!onlyPost(req, res)) return;

    const decoded = await verifyFirebaseToken(req);
    const uid = decoded.uid;

    const body = req.body || {};
    const plan = body.plan || {}; // { id: starter|pro|elite, priceINR }
    const planId = String(plan.id || "");
    const priceINR = Number(plan.priceINR);

    if (!planId) return bad(res, 400, "Missing plan.id");
    if (!Number.isFinite(priceINR) || priceINR <= 0) return bad(res, 400, "Invalid plan price");

    // If you already created Razorpay Plans on dashboard, you should pass razorpay_plan_id.
    // If not, simplest production route is to treat this as a 1-time order like buyer purchase.
    // Below is a safe 1-time order for seller plan fee:
    const amount = Math.round(priceINR * 100);

    const rzp = getRazorpayClient();
    const receipt = `sellerplan_${uid}_${Date.now()}`;

    const order = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        purpose: "seller_plan",
        sellerUid: uid,
        planId,
      },
    });

    const db = getDb();
    await db.collection("sellerOrders").doc(order.id).set(
      {
        sellerUid: uid,
        sellerEmail: decoded.email || "",
        planId,
        status: "created",
        createdAt: Date.now(),
        amount,
        currency: "INR",
      },
      { merge: true }
    );

    return ok(res, { orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    return bad(res, 500, e?.message || "create-subscription failed");
  }
}
