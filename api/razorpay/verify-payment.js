// FILE PATH: api/razorpay/verify-payment.js
import crypto from "crypto";
import { allowCors, readJSON, requireMethod, sendJSON, nowISO } from "../_lib/utils.js";
import { getRazorpayKeys } from "./_lib/razorpay.js";
import { getBucket, getDb } from "../_lib/firebaseAdmin.js";

function computeSignature(orderId, paymentId, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;
    if (!requireMethod(req, res, "POST")) return;

    const db = getDb();
    const bucket = getBucket();
    const { keySecret } = getRazorpayKeys();

    const body = await readJSON(req);

    const buyerUid = String(body?.buyerUid || "").trim();
    const buyerEmail = String(body?.buyerEmail || "").trim();
    const photo = body?.photo || {};

    const razorpay_order_id = String(body?.razorpay_order_id || "").trim();
    const razorpay_payment_id = String(body?.razorpay_payment_id || "").trim();
    const razorpay_signature = String(body?.razorpay_signature || "").trim();

    if (!buyerUid) return sendJSON(res, 400, { error: "Missing buyerUid" });
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendJSON(res, 400, { error: "Missing Razorpay payment fields" });
    }

    // 1) Verify signature
    const expected = computeSignature(razorpay_order_id, razorpay_payment_id, keySecret);
    if (expected !== razorpay_signature) {
      return sendJSON(res, 400, { error: "Invalid payment signature" });
    }

    // 2) Create a signed download URL
    // Works for public/images too; later you can move originals to private and it will still work.
    const storagePath = String(photo?.storagePath || photo?.id || "").replace(/^\/+/, "");
    let downloadUrl = "";

    if (storagePath) {
      const file = bucket.file(storagePath);
      const [exists] = await file.exists();
      if (exists) {
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 10 * 60 * 1000, // 10 minutes
        });
        downloadUrl = url;
      }
    }

    // 3) Write purchase record (server-only writes; your rules allow read by buyer)
    const purchaseDocId = `${buyerUid}_${razorpay_order_id}`;
    await db
      .collection("purchases")
      .doc(purchaseDocId)
      .set(
        {
          id: purchaseDocId,
          buyerUid,
          buyerEmail,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          price: Number(photo?.price || 0),
          displayName: String(photo?.displayName || ""),
          fileName: String(photo?.fileName || ""),
          storagePath,
          downloadUrl, // dashboard uses this
          status: "paid",
          createdAt: nowISO(),
          updatedAt: nowISO(),
        },
        { merge: true }
      );

    // 4) Update order status too
    await db
      .collection("orders")
      .doc(razorpay_order_id)
      .set({ status: "paid", paymentId: razorpay_payment_id, updatedAt: nowISO() }, { merge: true });

    return sendJSON(res, 200, { ok: true, purchaseId: purchaseDocId, downloadUrl });
  } catch (e) {
    console.error("verify-payment error:", e?.message || e);
    return sendJSON(res, 500, { error: e?.message || "Payment verification failed" });
  }
}
