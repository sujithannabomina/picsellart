import { getRazorpay } from "./razorpay.js";
import { db } from "../../src/lib/firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { buyerUid, amountINR, photoId, title } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });
    if (!photoId) return res.status(400).json({ error: "Missing photoId" });

    const amt = Number(amountINR);
    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ error: "Invalid amountINR" });

    const rz = getRazorpay();

    const order = await rz.orders.create({
      amount: Math.round(amt * 100),
      currency: "INR",
      receipt: `psa_${buyerUid.slice(0, 8)}_${photoId}`.slice(0, 40),
      payment_capture: 1,
      notes: {
        purpose: "photo_purchase",
        buyerUid,
        photoId,
        title: title || "PicSellArt Photo",
      },
    });

    // Store server-side order reference (server only)
    await db.collection("orders").doc(order.id).set(
      {
        orderId: order.id,
        buyerUid,
        photoId,
        amountINR: amt,
        currency: "INR",
        status: "created",
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // safe to send
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
