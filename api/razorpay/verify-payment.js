import crypto from "crypto";
import { db, bucket } from "../../src/lib/firebaseAdmin.js";

function verifySignature({ orderId, paymentId, signature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Missing RAZORPAY_KEY_SECRET in Vercel.");

  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const {
      buyerUid,
      photo,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });
    if (!photo?.id) return res.status(400).json({ error: "Missing photo.id" });
    if (!photo?.storagePath) return res.status(400).json({ error: "Missing photo.storagePath" });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay payment fields" });
    }

    const ok = verifySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!ok) return res.status(400).json({ error: "Payment verification failed" });

    // Mark order paid server-side
    await db.collection("orders").doc(razorpay_order_id).set(
      {
        status: "paid",
        paidAt: new Date().toISOString(),
        razorpay: {
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
        },
      },
      { merge: true }
    );

    // Create deterministic purchase id so we can avoid duplicates
    const purchaseId = `${buyerUid}_${photo.id}`.replace(/\//g, "_");

    // Generate signed download URL for ORIGINAL file
    const file = bucket.file(photo.storagePath);
    const [downloadUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    await db.collection("purchases").doc(purchaseId).set(
      {
        buyerUid,
        photoId: photo.id,
        fileName: photo.fileName || "",
        displayName: photo.name || photo.displayName || "Photo",
        price: Number(photo.price || 0),
        currency: "INR",
        storagePath: photo.storagePath,
        downloadUrl,
        createdAt: new Date().toISOString(),
        razorpay: {
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
        },
      },
      { merge: true }
    );

    return res.status(200).json({ ok: true, downloadUrl });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
