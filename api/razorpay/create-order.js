// FILE PATH: api/razorpay/create-order.js
const { getRazorpay } = require("./_lib/razorpay");
const { db } = require("../_lib/firebaseAdmin");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { buyerUid, amountINR, photo } = req.body || {};
    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });

    const amt = Number(amountINR);
    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ error: "Invalid amountINR" });

    const photoId = String(photo?.id || "");
    const fileName = String(photo?.fileName || "");
    const displayName = String(photo?.displayName || "Photo");
    const storagePath = String(photo?.storagePath || "");

    if (!photoId || !fileName || !storagePath) {
      return res.status(400).json({ error: "Missing photo details" });
    }

    const rz = getRazorpay();
    const amountPaise = Math.round(amt * 100);

    const receipt = `psa_${buyerUid.slice(0, 8)}_${Date.now()}`;

    const order = await rz.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes: {
        purpose: "buyer_purchase",
        buyerUid,
        photoId,
        fileName,
        displayName,
        storagePath,
      },
    });

    await db().collection("orders").doc(order.id).set(
      {
        orderId: order.id,
        buyerUid,
        amountINR: amt,
        amountPaise,
        currency: order.currency,
        receipt,
        status: order.status || "created",
        photo: { id: photoId, fileName, displayName, storagePath },
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
};
