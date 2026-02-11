// FILE PATH: api/razorpay/verify-payment.js
import crypto from "node:crypto";
import { bad, ok, onlyPost, safeEnv } from "../_lib/utils.js";
import { verifyFirebaseToken, getBucket, getDb } from "../_lib/firebaseAdmin.js";
import { getRazorpayClient } from "./_lib/razorpay.js";

function verifySignature({ order_id, payment_id, signature, secret }) {
  const body = `${order_id}|${payment_id}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export default async function handler(req, res) {
  try {
    if (!onlyPost(req, res)) return;

    const decoded = await verifyFirebaseToken(req);
    const uid = decoded.uid;

    const body = req.body || {};
    const photo = body.photo || {};

    const razorpay_order_id = body.razorpay_order_id;
    const razorpay_payment_id = body.razorpay_payment_id;
    const razorpay_signature = body.razorpay_signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return bad(res, 400, "Missing Razorpay fields");
    }

    const secret = safeEnv("RAZORPAY_KEY_SECRET");
    if (!secret) return bad(res, 500, "Missing RAZORPAY_KEY_SECRET");

    const valid = verifySignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
      secret,
    });

    if (!valid) return bad(res, 400, "Invalid payment signature");

    // Optional: fetch payment from Razorpay (extra validation)
    const rzp = getRazorpayClient();
    const payment = await rzp.payments.fetch(razorpay_payment_id);

    if (payment?.status !== "captured" && payment?.status !== "authorized") {
      return bad(res, 400, "Payment not completed", { status: payment?.status });
    }

    // Create a signed download URL for the paid/original file.
    // NOTE: This assumes originals are in Storage under "Buyer/..."
    // You can store photo.storagePath like: "Buyer/originals/sample1.jpg"
    const bucket = getBucket();
    const storagePath = String(photo.storagePath || "");
    let downloadUrl = "";

    if (storagePath) {
      const file = bucket.file(storagePath);
      // 7 days signed URL (works for dashboard downloads)
      const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const [url] = await file.getSignedUrl({
        action: "read",
        expires,
      });
      downloadUrl = url;
    }

    const db = getDb();

    // Update order
    await db.collection("orders").doc(razorpay_order_id).set(
      {
        status: "paid",
        paidAt: Date.now(),
        razorpay_payment_id,
        razorpay_signature,
        payment: {
          id: razorpay_payment_id,
          status: payment?.status || "",
          amount: payment?.amount || 0,
          currency: payment?.currency || "INR",
          method: payment?.method || "",
        },
      },
      { merge: true }
    );

    // Write purchase doc (server-only writes; your rules already enforce that)
    const purchaseId = `${razorpay_order_id}_${razorpay_payment_id}`;

    await db.collection("purchases").doc(purchaseId).set(
      {
        id: purchaseId,
        buyerUid: uid,
        buyerEmail: decoded.email || "",
        createdAt: Date.now(),
        price: Math.round((payment?.amount || 0) / 100),
        currency: payment?.currency || "INR",
        displayName: String(photo.displayName || ""),
        fileName: String(photo.fileName || ""),
        photoId: String(photo.id || ""),
        storagePath,
        downloadUrl, // signed URL
        razorpay: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        },
      },
      { merge: true }
    );

    return ok(res, { success: true, purchaseId, downloadUrl });
  } catch (e) {
    return bad(res, 500, e?.message || "verify-payment failed");
  }
}
