// Vercel serverless function – verifies signature and writes plan to Firestore
import crypto from "crypto";
import admin from "firebase-admin";

const APP_NAME = "picsellart-admin";
if (!admin.apps.length) {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT; // JSON string
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(key)),
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, uid, email } = req.body || {};

  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update((razorpay_order_id || "") + "|" + (razorpay_payment_id || ""))
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ status: "invalid-signature" });
  }

  await db.collection("payments").doc(razorpay_payment_id).set({
    uid, email, planId, orderId: razorpay_order_id, paymentId: razorpay_payment_id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  await db.collection("users").doc(uid).set({ plan: { id: planId } }, { merge: true });

  res.json({ status: "active" });
}
