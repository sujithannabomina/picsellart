import Razorpay from "razorpay";
import crypto from "crypto";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper: pull photo
async function getPhoto(photoId) {
  const doc = await db.collection("photos").doc(photoId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { photoId } = req.body || {};
    if (!photoId) {
      res.status(400).json({ error: "photoId required" });
      return;
    }

    const photo = await getPhoto(photoId);
    if (!photo || !photo.isPublished) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }

    // Amount in paise
    const amount = Math.max(1, Number(photo.price || 0)) * 100;

    // For now, all payments are collected to your account (payouts to sellers are manual/weekly)
    const order = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt: `photo_${photoId}_${Date.now()}`,
      notes: {
        photoId,
        ownerUid: photo.ownerUid || "",
        isSample: String(!!photo.isSample),
      },
    });

    res.status(200).json({ orderId: order.id, amount });
  } catch (e) {
    res.status(500).json({ error: e.message || "Order create failed" });
  }
}
