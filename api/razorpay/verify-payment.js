// FILE PATH: api/razorpay/verify-payment.js
const crypto = require("crypto");
const { db, bucket } = require("../_lib/firebaseAdmin");

function normalizeStoragePath(p) {
  const s = String(p || "").replace(/^\/+/, "");
  if (!s) return "";

  // Your checkout sometimes passes sample-public/... ; normalize it
  if (s.startsWith("sample-public/")) return s.replace("sample-public/", "public/");
  return s;
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });

    const {
      buyerUid,
      buyerEmail,
      photo,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay fields" });
    }

    // 1) Signature verification (PRODUCTION REQUIRED)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const storagePath = normalizeStoragePath(photo?.storagePath || "");
    const fileName = String(photo?.fileName || "");
    const displayName = String(photo?.displayName || "Photo");
    const price = Number(photo?.price || 0);

    if (!storagePath || !fileName || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid photo details" });
    }

    // SECURITY: only allow sample public images for now
    if (!storagePath.startsWith("public/images/")) {
      return res.status(400).json({ error: "Invalid storagePath" });
    }

    // 2) Signed URL for download (15 minutes)
    const file = bucket().file(storagePath);
    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ error: "File not found in storage" });

    const [downloadUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
    });

    // 3) Write purchases record (what your dashboard reads)
    // If your getPurchasesForBuyer() reads "purchases" collection with buyerUid, this matches it.
    await db().collection("purchases").add({
      buyerUid,
      buyerEmail: buyerEmail || "",
      price,
      displayName,
      fileName,
      storagePath,
      downloadUrl,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "paid",
      createdAt: new Date().toISOString(),
    });

    // 4) Update order status
    await db().collection("orders").doc(razorpay_order_id).set(
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        verifiedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).json({ success: true, downloadUrl });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Verification failed" });
  }
};
