import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amountInr, itemId, buyerEmail } = req.body || {};
    if (!amountInr || !itemId) return res.status(400).json({ error: "Missing amountInr or itemId" });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = Math.round(Number(amountInr) * 100); // paise
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `psa_${Date.now()}`,
      notes: {
        itemId: String(itemId),
        buyerEmail: String(buyerEmail || ""),
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e) {
    return res.status(500).json({ error: "Create order failed", details: e?.message });
  }
}
