// FILE PATH: api/razorpay/verify-payment.js
import crypto from "crypto";
import { db, bucket } from "../../src/lib/firebaseAdmin.js";

function verifySignature({ orderId, paymentId, signature }, keySecret) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
  return expected === signature;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });

    const {
      buyerUid,
      photo, // { id, fileName, name/displayName, price, storagePath }
      razorpay, // { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });
    if (!photo?.price || !photo?.storagePath) return res.status(400).json({ error: "Missing photo details" });

    const orderId = razorpay?.razorpay_order_id;
    const paymentId = razorpay?.razorpay_payment_id;
    const signature = razorpay?.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: "Missing Razorpay payment payload" });
    }

    const ok = verifySignature({ orderId, paymentId, signature }, keySecret);
    if (!ok) return res.status(400).json({ error: "Payment verification failed" });

    // Generate signed download URL (valid for 15 minutes)
    const file = bucket.file(photo.storagePath);
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
    });

    // Write purchase record (server-side, trusted)
    const purchaseDoc = {
      buyerUid,
      photoId: photo?.id || "",
      fileName: photo?.fileName || "",
      displayName: photo?.name || photo?.displayName || "Photo",
      price: Number(photo?.price || 0),
      currency: "INR",
      storagePath: photo.storagePath,
      downloadUrl: signedUrl,
      createdAt: new Date(),
      razorpay: {
        orderId,
        paymentId,
        signature,
      },
    };

    await db.collection("purchases").add(purchaseDoc);

    return res.status(200).json({
      ok: true,
      downloadUrl: signedUrl,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
