// api/verifyPayment.js
import crypto from "crypto";
import { initAdmin } from "./_lib/firebaseAdmin.js";
import { allowCors, ok, bad } from "./_lib/utils.js";

function verifySignature({ orderId, paymentId, signature, keySecret }) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
  return expected === signature;
}

function normalizeStoragePath(p) {
  if (!p) return "";
  let s = String(p);

  try {
    s = decodeURIComponent(s);
  } catch {}

  s = s.replace(/^gs:\/\/[^/]+\//, "");
  s = s.replace(/^\/+/, "");
  return s;
}

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;

    if (req.method !== "POST") {
      return bad(res, 405, "Method not allowed. Use POST.");
    }

    const body = req.body || {};
    const buyerUid = String(body.buyerUid || "").trim();
    const buyerEmail = String(body.buyerEmail || "").trim();
    const photo = body.photo || {};

    const orderId = String(body.razorpay_order_id || "").trim();
    const paymentId = String(body.razorpay_payment_id || "").trim();
    const signature = String(body.razorpay_signature || "").trim();

    if (!buyerUid) return bad(res, 400, "Missing buyerUid.");
    if (!orderId || !paymentId || !signature) return bad(res, 400, "Missing Razorpay fields.");

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return bad(res, 500, "Server misconfigured: missing RAZORPAY_KEY_SECRET.");

    const valid = verifySignature({ orderId, paymentId, signature, keySecret });
    if (!valid) return bad(res, 400, "Invalid payment signature.");

    const admin = initAdmin();
    const db = admin.firestore();
    const bucket = admin.storage().bucket();

    // You currently only have public/images
    const storagePath = normalizeStoragePath(photo.storagePath || photo.id || "");
    if (!storagePath) return bad(res, 400, "Missing photo storagePath.");

    const [downloadUrl] = await bucket.file(storagePath).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    const purchaseDocId = `${buyerUid}_${paymentId}`;
    const now = admin.firestore.FieldValue.serverTimestamp();

    await db.collection("purchases").doc(purchaseDocId).set(
      {
        id: purchaseDocId,
        buyerUid,
        buyerEmail,
        price: Number(photo.price || 0),
        fileName: String(photo.fileName || ""),
        displayName: String(photo.displayName || ""),
        storagePath,
        downloadUrl,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        status: "paid",
        createdAt: now,
      },
      { merge: true }
    );

    await db.collection("orders").doc(orderId).set(
      {
        orderId,
        buyerUid,
        buyerEmail,
        status: "paid",
        razorpay_payment_id: paymentId,
        createdAt: now,
      },
      { merge: true }
    );

    return ok(res, { success: true, downloadUrl });
  } catch (e) {
    return bad(res, 500, "Payment verification failed", { detail: e?.message || "Unknown error" });
  }
}
