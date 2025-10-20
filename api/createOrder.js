// api/createOrder.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { amount, currency = "INR", itemId, title, source = "explore-public" } = req.body || {};
    if (!amount || !itemId) {
      return res.status(400).json({ error: "amount and itemId required" });
    }

    // Your master account (for public/explore images)
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await rzp.orders.create({
      amount: Math.max(100, Number(amount)), // >= ₹1.00
      currency,
      receipt: `picsellart_${itemId}_${Date.now()}`,
      notes: { title, source },
    });

    return res.status(200).json(order);
  } catch (e) {
    console.error("createOrder error", e);
    return res.status(500).json({ error: "server" });
  }
}
