// FILE PATH: api/razorpay/verify-payment.js
const crypto = require("crypto");
const { setCors, readJson, send } = require("../_lib/utils");
const { getDb, getBucket } = require("../_lib/firebaseAdmin");

function verifySignature(orderId, paymentId, signature, secret) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

async function trySignedUrl(storagePath) {
  if (!storagePath) return "";
  try {
    const bucket = getBucket();
    const file = bucket.file(storagePath);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });
    return url || "";
  } catch {
    return "";
  }
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);

    const buyerUid = body?.buyerUid;
    const buyerEmail = body?.buyerEmail || "";
    const photo = body?.photo || {};

    const orderId = body?.razorpay_order_id;
    const paymentId = body?.razorpay_payment_id;
    const signature = body?.razorpay_signature;

    if (!buyerUid) return send(res, 400, { error: "Missing buyerUid" });
    if (!orderId || !paymentId || !signature) return send(res, 400, { error: "Missing Razorpay fields" });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return send(res, 500, { error: "Server misconfigured (missing secret)" });

    const ok = verifySignature(orderId, paymentId, signature, secret);
    if (!ok) return send(res, 400, { error: "Invalid payment signature" });

    const db = getDb();

    // Mark order paid
    await db
      .collection("buyers")
      .doc(buyerUid)
      .collection("orders")
      .doc(orderId)
      .set(
        {
          status: "paid",
          paymentId,
          signature,
          paidAt: new Date().toISOString(),
        },
        { merge: true }
      );

    // Generate signed URL (best user experience)
    const storagePath = String(photo?.storagePath || "");
    const downloadUrl = await trySignedUrl(storagePath);

    // Save purchase record (BuyerDashboard reads this)
    const purchaseId = paymentId; // stable unique id
    await db
      .collection("buyers")
      .doc(buyerUid)
      .collection("purchases")
      .doc(purchaseId)
      .set({
        id: purchaseId,
        buyerUid,
        buyerEmail,
        orderId,
        paymentId,
        photo,
        price: Number(photo?.price || 0),
        storagePath,
        downloadUrl, // may be empty (dashboard can generate too)
        createdAt: new Date().toISOString(),
      });

    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { error: e?.message || "Verify failed" });
  }
};
