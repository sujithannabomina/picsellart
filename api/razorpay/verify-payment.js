// FILE PATH: api/razorpay/verify-payment.js
const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", key_secret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Verify error" });
  }
};
