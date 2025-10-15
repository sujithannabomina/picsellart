import Razorpay from "razorpay";
import admin from "firebase-admin";
import { checkRateLimit } from "./_rateLimit.js";

if (!admin.apps.length) {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT;
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(key)) });
}
const db = admin.firestore();

export default async function handler(req, res){
  if (req.method !== "POST") return res.status(405).end();

  const rl = await checkRateLimit(req);
  if (!rl.ok) return res.status(429).json({ error: "rate-limit" });

  const { photoId } = req.body || {};
  if (!photoId) return res.status(400).json({ error: "photoId-required" });

  const snap = await db.collection("photos").doc(photoId).get();
  if (!snap.exists) return res.status(404).json({ error: "photo-not-found" });
  const photo = snap.data();

  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const amount = Math.round(Number(photo.price) * 100); // paise
  const order = await rzp.orders.create({
    amount, currency: "INR",
    receipt: `photo_${photoId}_${Date.now()}`,
    notes: { photoId }
  });

  res.json({ orderId: order.id, amount, photoId, photoTitle: photo.title });
}
