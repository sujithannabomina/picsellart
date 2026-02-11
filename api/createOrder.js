// api/createOrder.js
import crypto from "crypto";
import { getRazorpay } from "./_lib/razorpay.js";
import { allowCors, ok, bad } from "./_lib/utils.js";

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;

    if (req.method !== "POST") {
      return bad(res, 405, "Method not allowed. Use POST.");
    }

    const body = req.body || {};
    const buyerUid = String(body.buyerUid || "").trim();
    const amountINR = Number(body.amountINR);
    const photo = body.photo || {};

    if (!buyerUid) return bad(res, 400, "Missing buyerUid.");
    if (!Number.isFinite(amountINR) || amountINR <= 0) return bad(res, 400, "Invalid amount.");

    // Razorpay uses paise
    const amount = Math.round(amountINR * 100);

    const rz = getRazorpay();
    const receipt = `psa_${buyerUid}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const order = await rz.orders.create({
      amount,
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes: {
        purpose: "buyer_purchase",
        buyerUid,
        photoId: String(photo.id || ""),
        storagePath: String(photo.storagePath || ""),
        fileName: String(photo.fileName || ""),
        displayName: String(photo.displayName || ""),
        priceINR: String(amountINR),
      },
    });

    return ok(res, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e) {
    return bad(res, 500, "Order creation failed", { detail: e?.message || "Unknown error" });
  }
}
