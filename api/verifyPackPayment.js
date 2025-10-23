import Razorpay from "razorpay";
import crypto from "crypto";
import admin from "firebase-admin";
import { PRICE_PLANS } from "../src/utils/plans.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}
const db = admin.firestore();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packId, uid, email } = req.body || {};

    // HMAC check
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (expected !== razorpay_signature) return res.status(400).json({ status: "invalid-signature" });

    // Verify payment is captured
    const payment = await rzp.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status !== "captured" || payment.order_id !== razorpay_order_id) {
      return res.status(400).json({ status: "payment-not-captured" });
    }

    // Lookup plan
    const pack = PRICE_PLANS.find(p => p.id === packId);
    if (!pack) return res.status(400).json({ status: "invalid-pack" });

    // Compute expiry (180 days)
    const now = admin.firestore.Timestamp.now();
    const expiresAt = admin.firestore.Timestamp.fromMillis(now.toMillis() + pack.durationDays * 86400000);

    // Save on user
    await db.collection("users").doc(uid).set({
      email, role: "seller",
      plan: {
        id: pack.id,
        name: pack.name,
        uploadLimit: pack.uploadLimit,
        maxPricePerPhoto: pack.maxPricePerPhoto,
        packPrice: pack.packPrice,
        expiresAt
      }
    }, { merge: true });

    res.json({ status: "activated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "error" });
  }
}
