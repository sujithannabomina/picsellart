// FILE PATH: api/razorpay/create-order.js
import { getRazorpay } from "./razorpay.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { amount, currency, receipt, notes } = req.body || {};
    const amt = Number(amount || 0);

    if (!amt || amt < 100) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const rz = getRazorpay();

    const order = await rz.orders.create({
      amount: amt,
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
