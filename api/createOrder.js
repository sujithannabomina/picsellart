// api/createOrder.js
import crypto from "node:crypto";

// Use server-side env names (no VITE_ prefix)
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    if (!key_id || !key_secret) {
      return res.status(500).json({ error: "Razorpay keys missing" });
    }

    const { mode, amount } = req.body || {};
    if (!mode || !amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Create order
    const payload = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `picsellart_${mode}_${Date.now()}`,
      payment_capture: 1,
    };

    // Create using REST — minimal dependency (no SDK)
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${key_id}:${key_secret}`).toString("base64"),
      },
      body: JSON.stringify(payload),
    });

    if (!orderRes.ok) {
      const msg = await orderRes.text();
      return res.status(502).json({ error: "Razorpay order failed", msg });
    }
    const orderJson = await orderRes.json();

    // Return only what client needs
    return res.status(200).json({
      orderId: orderJson.id,
      currency: orderJson.currency || "INR",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
