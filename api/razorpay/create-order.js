// FILE PATH: api/razorpay/create-order.js
import crypto from "crypto";
import { allowCors, readJSON, requireMethod, sendJSON, nowISO } from "../_lib/utils.js";
import { razorpayRequest } from "./_lib/razorpay.js";
import { getDb } from "../_lib/firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;
    if (!requireMethod(req, res, "POST")) return;

    const db = getDb();
    const body = await readJSON(req);

    const buyerUid = String(body?.buyerUid || "").trim();
    const amountINR = Number(body?.amountINR || 0);
    const photo = body?.photo || {};

    if (!buyerUid) return sendJSON(res, 400, { error: "Missing buyerUid" });
    if (!Number.isFinite(amountINR) || amountINR <= 0) {
      return sendJSON(res, 400, { error: "Invalid amountINR" });
    }

    const amount = Math.round(amountINR * 100); // paise
    const receipt = `psa_${buyerUid}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    // Create Razorpay Order
    const order = await razorpayRequest("/v1/orders", {
      method: "POST",
      body: {
        amount,
        currency: "INR",
        receipt,
        payment_capture: 1,
        notes: {
          purpose: "buyer_purchase",
          buyerUid,
          photoId: String(photo?.id || ""),
          storagePath: String(photo?.storagePath || ""),
          fileName: String(photo?.fileName || ""),
        },
      },
    });

    // Store minimal server-side order record (optional but useful)
    await db
      .collection("orders")
      .doc(order.id)
      .set(
        {
          orderId: order.id,
          buyerUid,
          amountINR,
          amount,
          currency: "INR",
          receipt,
          status: "created",
          photo: {
            id: String(photo?.id || ""),
            storagePath: String(photo?.storagePath || ""),
            fileName: String(photo?.fileName || ""),
            displayName: String(photo?.displayName || ""),
            price: amountINR,
          },
          createdAt: nowISO(),
          updatedAt: nowISO(),
        },
        { merge: true }
      );

    return sendJSON(res, 200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (e) {
    console.error("create-order error:", e?.message || e);
    return sendJSON(res, 500, { error: e?.message || "Order creation failed" });
  }
}
