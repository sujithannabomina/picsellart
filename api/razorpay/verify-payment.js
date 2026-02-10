// FILE PATH: api/razorpay/verify-payment.js
const crypto = require("crypto");
const { getDb, getBucket } = require("../_lib/firebaseAdmin");

function json(res, code, data) {
  res.status(code).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function normalizeStoragePath(p) {
  const s = String(p || "");
  if (s.startsWith("sample-public/")) return s.replace(/^sample-public\//, "public/");
  return s;
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

    const {
      buyerUid,
      photo,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    const buyer = String(buyerUid || "");
    if (!buyer) return json(res, 400, { error: "Missing buyerUid" });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json(res, 400, { error: "Missing Razorpay fields" });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) return json(res, 500, { error: "Missing RAZORPAY_KEY_SECRET on server" });

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", key_secret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return json(res, 400, { error: "Invalid signature" });
    }

    const p = photo || {};
    const storagePath = normalizeStoragePath(p.storagePath || p.id || "");
    const fileName = String(p.fileName || storagePath.split("/").pop() || "");
    const displayName = String(p.displayName || "Photo");
    const price = Number(p.price || 0);

    if (!storagePath) return json(res, 400, { error: "Missing photo storagePath" });

    // Create short-lived signed URL (works for sample images and seller images)
    const bucket = getBucket();
    const file = bucket.file(storagePath);

    const [exists] = await file.exists();
    if (!exists) {
      return json(res, 404, { error: "File not found in storage: " + storagePath });
    }

    // 24 hours link (you can reduce later)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Write purchase record
    const db = getDb();

    const purchaseId = `${buyer}_${razorpay_payment_id}`;
    await db.collection("purchases").doc(purchaseId).set(
      {
        buyerUid: buyer,
        photoId: String(p.id || storagePath),
        fileName,
        displayName,
        price,
        currency: "INR",
        storagePath,
        downloadUrl: signedUrl,
        createdAt: new Date().toISOString(),
        razorpay: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
        status: "paid",
        source: "vercel_api",
      },
      { merge: true }
    );

    // Also update order doc (optional but nice)
    await db.collection("orders").doc(razorpay_order_id).set(
      {
        status: "paid",
        paidAt: new Date().toISOString(),
        razorpay: {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      },
      { merge: true }
    );

    return json(res, 200, { success: true, downloadUrl: signedUrl });
  } catch (e) {
    return json(res, 500, { error: e?.message || "Server error" });
  }
};
