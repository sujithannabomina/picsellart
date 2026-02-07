// FILE PATH: api/razorpay/create-order.js
const { getRazorpay } = require("./razorpay");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { amountINR, notes } = req.body || {};
    const amt = Number(amountINR || 0);

    if (!amt || amt < 1) return res.status(400).json({ error: "Invalid amountINR" });

    const rz = getRazorpay();

    const order = await rz.orders.create({
      amount: Math.round(amt * 100),
      currency: "INR",
      receipt: `psa_${Date.now()}`,
      payment_capture: 1,
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
};
