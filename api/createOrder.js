// Vercel serverless function – creates a Razorpay order
import Razorpay from "razorpay";

const PLANS = {
  starter: { name: "Starter", amount: 19900 },
  pro:     { name: "Pro",     amount: 49900 },
  elite:   { name: "Elite",   amount: 99900 },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { planId } = req.body || {};
  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ error: "invalid-plan" });

  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await rzp.orders.create({
    amount: plan.amount,
    currency: "INR",
    receipt: `plan_${planId}_${Date.now()}`,
    notes: { planId },
  });

  res.json({ orderId: order.id, amount: plan.amount, planId, planName: plan.name });
}
