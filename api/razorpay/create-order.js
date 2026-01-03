import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amountInPaise, currency = "INR", receipt, notes } = req.body || {};

    if (!amountInPaise || typeof amountInPaise !== "number") {
      return res.status(400).json({ error: "amountInPaise is required (number)" });
    }

    const key_id = process.env.VITE_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(500).json({ error: "Missing Razorpay env variables" });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json(order);
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Order create failed" });
  }
}
