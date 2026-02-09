// FILE PATH: api/razorpay/create-order.js
const { getRazorpay } = require("./razorpay");
const { db } = require("../../src/lib/firebaseAdmin");

/**
 * Buyer one-time payment:
 * Creates a Razorpay ORDER and returns { orderId, amount, currency, receipt }
 *
 * Body:
 *  {
 *    buyerUid: string,
 *    amountINR: number,
 *    photo: { id, fileName, displayName, storagePath, downloadUrl }
 *  }
 */
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { buyerUid, amountINR, photo } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });

    const amt = Number(amountINR);
    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ error: "Invalid amountINR" });

    // Minimal photo validation (keeps your UI flow stable)
    const photoId = String(photo?.id || "");
    const fileName = String(photo?.fileName || "");
    const displayName = String(photo?.displayName || photo?.name || "Photo");
    const storagePath = String(photo?.storagePath || "");
    const downloadUrl = String(photo?.downloadUrl || photo?.originalUrl || photo?.url || "");

    if (!photoId && !fileName && !downloadUrl) {
      return res.status(400).json({ error: "Missing photo details" });
    }

    const rz = getRazorpay();

    const amountPaise = Math.round(amt * 100);
    const currency = "INR";

    const receipt = `psa_${buyerUid.slice(0, 8)}_${Date.now()}`;

    // Create Razorpay order
    const order = await rz.orders.create({
      amount: amountPaise,
      currency,
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

    // Store order in Firestore (server-side log)
    await db.collection("orders").doc(order.id).set(
      {
        orderId: order.id,
        buyerUid,
        amountINR: amt,
        amountPaise,
        currency,
        receipt,
        status: order.status,
        photo: {
          id: photoId,
          fileName,
          displayName,
          storagePath,
          downloadUrl,
        },
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
