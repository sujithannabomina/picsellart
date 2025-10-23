import Razorpay from "razorpay";
import { PRICE_PLANS } from "../src/utils/plans.js";

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { packId } = req.body || {};
  const plan = PRICE_PLANS.find(p => p.id === packId);
  if (!plan) return res.status(400).json({ error: "invalid-pack" });

  const amount = plan.packPrice * 100; // paise
  const order = await rzp.orders.create({
    amount,
    currency: "INR",
    receipt: `pack_${packId}_${Date.now()}`,
    notes: { packId }
  });

  res.json({ orderId: order.id, amount });
}
