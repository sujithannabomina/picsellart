// FILE PATH: api/razorpay/create-subscription.js
import crypto from "crypto";
import { allowCors, readJSON, requireMethod, sendJSON, nowISO } from "../_lib/utils.js";
import { razorpayRequest } from "./_lib/razorpay.js";
import { getDb } from "../_lib/firebaseAdmin.js";

const PLAN_PRICE_INR = {
  starter: 100,
  pro: 300,
  elite: 800,
};

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;
    if (!requireMethod(req, res, "POST")) return;

    const db = getDb();
    const body = await readJSON(req);

    const sellerUid = String(body?.sellerUid || "").trim();
    const planId = String(body?.planId || "").trim(); // starter | pro | elite
    const amountINR = Number(body?.amountINR || PLAN_PRICE_INR[planId] || 0);

    if (!sellerUid) return sendJSON(res, 400, { error: "Missing sellerUid" });
    if (!PLAN_PRICE_INR[planId]) return sendJSON(res, 400, { error: "Invalid planId" });
    if (!Number.isFinite(amountINR) || amountINR <= 0) {
      return sendJSON(res, 400, { error: "Invalid amountINR" });
    }

    const amount = Math.round(amountINR * 100);
    const receipt = `psa_plan_${sellerUid}_${planId}_${Date.now()}_${crypto
      .randomBytes(4)
      .toString("hex")}`;

    const order = await razorpayRequest("/v1/orders", {
      method: "POST",
      body: {
        amount,
        currency: "INR",
        receipt,
        payment_capture: 1,
        notes: {
          purpose: "seller_plan",
          sellerUid,
          planId,
        },
      },
    });

    await db
      .collection("sellerPlanOrders")
      .doc(order.id)
      .set(
        {
          orderId: order.id,
          sellerUid,
          planId,
          amountINR,
          amount,
          currency: "INR",
          status: "created",
          createdAt: nowISO(),
          updatedAt: nowISO(),
        },
        { merge: true }
      );

    return sendJSON(res, 200, { orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    console.error("create-subscription error:", e?.message || e);
    return sendJSON(res, 500, { error: e?.message || "Plan order creation failed" });
  }
}
