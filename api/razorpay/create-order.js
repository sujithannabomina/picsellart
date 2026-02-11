// FILE PATH: api/razorpay/create-order.js
const { setCors, readJson, send } = require("../_lib/utils");
const { getRazorpay } = require("./_lib/razorpay");
const { getDb } = require("../_lib/firebaseAdmin");

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);
    const buyerUid = body?.buyerUid;
    const amountINR = Number(body?.amountINR || 0);
    const photo = body?.photo || {};

    if (!buyerUid) return send(res, 400, { error: "Missing buyerUid" });
    if (!Number.isFinite(amountINR) || amountINR <= 0) return send(res, 400, { error: "Invalid amountINR" });

    const amount = Math.round(amountINR * 100); // paise
    const rzp = getRazorpay();

    const order = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt: `psa_${buyerUid}_${Date.now()}`,
      notes: {
        purpose: "buyer_purchase",
        buyerUid,
        photoId: String(photo?.id || ""),
        storagePath: String(photo?.storagePath || ""),
      },
    });

    const db = getDb();

    // Save pending order (for audit + matching)
    await db
      .collection("buyers")
      .doc(buyerUid)
      .collection("orders")
      .doc(order.id)
      .set({
        orderId: order.id,
        status: "created",
        amountINR,
        amount,
        currency: order.currency,
        photo,
        createdAt: new Date().toISOString(),
      });

    return send(res, 200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e) {
    return send(res, 500, { error: e?.message || "Create order failed" });
  }
};
