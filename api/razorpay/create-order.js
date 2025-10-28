// api/razorpay/create-order.js
// Vercel Serverless Function – creates a Razorpay order and returns { orderId, amount, currency }

import Razorpay from "razorpay";

// Ensure these are set in Vercel Project → Environment Variables
const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY;

// Optional: Node runtime
export const config = {
  runtime: "nodejs18.x",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (!key_id || !key_secret) {
      return res
        .status(500)
        .json({ error: "Missing Razorpay credentials on server" });
    }

    const { amount, currency = "INR" } = req.body || {};
    const amountNum = Number(amount);
    if (!amountNum || amountNum < 100) {
      return res.status(400).json({ error: "Invalid amount (in paise)" });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: amountNum, // paise
      currency,
      receipt: `sub_${Date.now()}`,
      payment_capture: 1,
      notes: { purpose: "seller_subscription" },
    });

    // Normalize to the shape our client expects
    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return res
      .status(500)
      .json({ error: "Failed to create order", details: err?.message });
  }
}
