import Razorpay from "razorpay";
import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const RZ_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RZ_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Price plan map must match front-end
const PLANS = {
  starter: { name: "Starter", amount: 19900 }, // in paise
  pro:     { name: "Pro",     amount: 49900 },
  elite:   { name: "Elite",   amount: 99900 }
};

const razorpay = new Razorpay({ key_id: RZ_KEY_ID, key_secret: RZ_KEY_SECRET });

// Create order
export const createOrder = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { planId } = req.body || {};
  const plan = PLANS[planId];
  if (!plan) return res.status(400).json({ error: "invalid-plan" });
  const order = await razorpay.orders.create({
    amount: plan.amount,
    currency: "INR",
    receipt: `plan_${planId}_${Date.now()}`,
    notes: { planId }
  });
  res.json({ orderId: order.id, amount: plan.amount, planId, planName: plan.name });
});

// Verify payment and activate plan
export const verifyPayment = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, uid, email } = req.body || {};
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RZ_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: "invalid-signature" });
    }
    // Mark active
    await db.collection("payments").doc(razorpay_payment_id).set({
      uid, email, planId, orderId: razorpay_order_id, paymentId: razorpay_payment_id, createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await db.collection("users").doc(uid).set({ plan: { id: planId } }, { merge: true });
    res.json({ status: "active" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
