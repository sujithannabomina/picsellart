import crypto from "crypto";
import admin from "firebase-admin";
import Razorpay from "razorpay";
import { checkRateLimit } from "./_rateLimit.js";

if (!admin.apps.length) {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT;
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(key)) });
}
const db = admin.firestore();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res){
  if (req.method !== "POST") return res.status(405).end();

  const rl = await checkRateLimit(req);
  if (!rl.ok) return res.status(429).json({ error: "rate-limit" });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, photoId, uid, email } = req.body || {};

  // HMAC check
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (expected !== razorpay_signature) return res.status(400).json({ status: "invalid-signature" });

  // Pull payment from Razorpay and validate
  const payment = await rzp.payments.fetch(razorpay_payment_id);
  if (!payment || payment.status !== "captured" || payment.order_id !== razorpay_order_id) {
    return res.status(400).json({ status: "payment-not-captured" });
  }

  // Cross-check price from Firestore (server truth)
  const photoSnap = await db.collection("photos").doc(photoId).get();
  if (!photoSnap.exists) return res.status(404).json({ status: "photo-not-found" });
  const photo = photoSnap.data();

  const expectedAmount = Math.round(Number(photo.price) * 100);
  if (payment.amount !== expectedAmount) {
    return res.status(400).json({ status: "amount-mismatch" });
  }

  // Idempotent record
  const purchaseId = `${uid}_${photoId}_${razorpay_payment_id}`;
  const pRef = db.collection("purchases").doc(purchaseId);
  const exists = await pRef.get();
  if (!exists.exists) {
    await pRef.set({
      id: purchaseId,
      buyerUid: uid, buyerEmail: email,
      photoId, price: photo.price, title: photo.title, watermarkedUrl: photo.watermarkedUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentId: razorpay_payment_id, orderId: razorpay_order_id, amount: payment.amount
    });
  }
  res.json({ status: "paid" });
}
