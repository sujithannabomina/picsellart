/* eslint-disable no-console */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Razorpay instance from Firebase env config:
//   firebase functions:config:set razorpay.key_id="xxx" razorpay.key_secret="yyy"
const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

/**
 * Utility: build a canonical record for a purchased image
 */
function purchaseRecord({ buyerUid, buyerEmail, imageName, amount, currency, razorpayOrderId, razorpayPaymentId }) {
  return {
    buyerUid: buyerUid || null,
    buyerEmail: buyerEmail || null,
    imageName,
    amount,
    currency,
    razorpayOrderId,
    razorpayPaymentId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "paid",
    source: "explore",
  };
}

/**
 * HTTP: Create Razorpay order for a single photo
 * POST /createPhotoOrder
 * body: { amount, currency, receipt, notes }
 */
exports.createPhotoOrder = functions.https.onRequest(async (req, res) => {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  try {
    const { amount, currency = "INR", receipt, notes } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt || `photo_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json(order);
  } catch (err) {
    console.error("createPhotoOrder error:", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

/**
 * HTTP: Verify Razorpay payment & record purchase
 * POST /verifyPhotoPayment
 * body: {
 *   razorpay_order_id,
 *   razorpay_payment_id,
 *   razorpay_signature,
 *   imageName,
 *   amount,
 *   currency,
 *   buyerUid,
 *   buyerEmail
 * }
 */
exports.verifyPhotoPayment = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      imageName,
      amount,
      currency = "INR",
      buyerUid,
      buyerEmail,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", functions.config().razorpay.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("Signature mismatch", { razorpay_order_id, razorpay_payment_id });
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Record purchase in Firestore (for Buyer Dashboard)
    const docData = purchaseRecord({
      buyerUid,
      buyerEmail,
      imageName,
      amount,
      currency,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await db.collection("purchases").add(docData);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("verifyPhotoPayment error:", err);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
});

/**
 * Example protected endpoint to get original download URL.
 * You can adapt this to your storage layout.
 *
 * GET /getOriginalUrl?imageName=foo.jpg
 */
exports.getOriginalUrl = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.set("Access-Control-Allow-Origin", "*");

  try {
    const { imageName } = req.query;
    if (!imageName) {
      return res.status(400).json({ error: "Missing imageName" });
    }

    // Example path: gs://bucket/Buyer/originals/<imageName>
    const bucket = admin.storage().bucket();
    const file = bucket.file(`Buyer/${imageName}`);

    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: "File not found" });
    }

    // Signed URL valid for 15 minutes
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
    });

    return res.status(200).json({ url });
  } catch (err) {
    console.error("getOriginalUrl error:", err);
    return res.status(500).json({ error: "Failed to get URL" });
  }
});
