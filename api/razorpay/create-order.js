// api/razorpay/create-order.js

import Razorpay from "razorpay";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { amount, currency = "INR", receipt, notes } = req.body || {};
    const amt = Number(amount);

    if (!amt || amt < 100) return res.status(400).json({ error: "Invalid amount" });

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(500).json({ error: "Missing Razorpay env vars" });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: amt,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id, // frontend needs this for Razorpay checkout
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Create order failed" });
  }
}
