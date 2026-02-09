// FILE PATH: api/razorpay/verify-payment.js
const crypto = require("crypto");
const { db } = require("../../src/lib/firebaseAdmin");

/**
 * Verifies Razorpay signature (production requirement)
 * Body:
 * {
 *   buyerUid,
 *   photo,
 *   razorpay_order_id,
 *   razorpay_payment_id,
 *   razorpay_signature
 * }
 */
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const {
      buyerUid,
      photo,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing razorpay fields" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

    const isValid = expected === razorpay_signature;
    if (!isValid) return res.status(400).json({ error: "Signature verification failed" });

    // Mark order as paid
    await db.collection("orders").doc(razorpay_order_id).set(
      {
        status: "paid",
        paidAt: new Date().toISOString(),
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
      { merge: true }
    );

    // Create purchase record (this is what BuyerDashboard reads)
    const photoId = String(photo?.id || "");
    const fileName = String(photo?.fileName || "");
    const displayName = String(photo?.displayName || photo?.name || "Photo");
    const storagePath = String(photo?.storagePath || "");
    const downloadUrl = String(photo?.downloadUrl || photo?.originalUrl || photo?.url || "");

    const price = Number(photo?.price || 0);

    await db.collection("purchases").add({
      buyerUid,
      photoId,
      fileName,
      displayName,
      price,
      currency: "INR",
      storagePath,
      downloadUrl,
      createdAt: new Date().toISOString(),
      razorpay: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
};
