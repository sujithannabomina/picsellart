import crypto from "crypto";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      photoId,
    } = req.body || {};

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !photoId) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const hmac = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (hmac !== razorpay_signature) {
      res.status(400).json({ error: "Signature mismatch" });
      return;
    }

    const photoRef = db.collection("photos").doc(photoId);
    const photoSnap = await photoRef.get();
    if (!photoSnap.exists) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    const photo = photoSnap.data();

    // Write order
    const orderRef = db.collection("orders").doc(razorpay_payment_id);
    await orderRef.set({
      id: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "paid",
      buyerUid: req.headers["x-user-uid"] || "", // optional, can be empty
      photoId,
      title: photo.title || "Photo",
      price: photo.price || 0,
      originalUrl: photo.originalUrl, // buyer gets HD
      createdAt: new Date(),
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Verify failed" });
  }
}
