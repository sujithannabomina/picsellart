// api/create-order.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({ error: "Missing Razorpay env vars (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)" });
    }

    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const { amount, currency, receipt, notes } = req.body || {};
    const amt = Number(amount);

    if (!amt || amt < 1) return res.status(400).json({ error: "Invalid amount" });

    const order = await rzp.orders.create({
      amount: Math.round(amt * 100), // rupees → paise
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json({ keyId, order });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Order creation failed" });
  }
}
