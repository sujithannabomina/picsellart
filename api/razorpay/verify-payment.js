// FILE PATH: api/razorpay/verify-payment.js
const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: "Missing Razorpay secret on server" });

    const {
      buyerUid,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });
    if (!razorpay_order_id) return res.status(400).json({ error: "Missing order id" });
    if (!razorpay_payment_id) return res.status(400).json({ error: "Missing payment id" });
    if (!razorpay_signature) return res.status(400).json({ error: "Missing signature" });

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const verified = expected === razorpay_signature;

    if (!verified) return res.status(400).json({ verified: false, error: "Invalid signature" });

    return res.status(200).json({ verified: true });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
};
