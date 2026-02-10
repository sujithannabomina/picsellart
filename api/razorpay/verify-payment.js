// FILE PATH: api/razorpay/verify-payment.js
const crypto = require("crypto");
const { db } = require("../_lib/firebaseAdmin");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });

    const {
      buyerUid,
      photo,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Mark order paid
    await db.collection("orders").doc(razorpay_order_id).set(
      {
        status: "paid",
        paidAt: new Date().toISOString(),
        razorpay_payment_id,
      },
      { merge: true }
    );

    // Create purchase record
    await db.collection("purchases").add({
      buyerUid,
      photo: photo || null,
      razorpay_order_id,
      razorpay_payment_id,
      createdAt: new Date().toISOString(),
      status: "paid",
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
};
