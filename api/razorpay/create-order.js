// FILE PATH: api/razorpay/create-order.js
import { getRazorpay } from "./razorpay.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { amountINR, receipt, notes } = req.body || {};
    const amt = Number(amountINR);

    if (!amt || Number.isNaN(amt) || amt < 1) {
      return res.status(400).json({ error: "Invalid amountINR" });
    }

    const rz = getRazorpay();

    const order = await rz.orders.create({
      amount: Math.round(amt * 100), // paise
      currency: "INR",
      receipt: receipt || `buyer_${Date.now()}`,
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
