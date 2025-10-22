// /api/verifyPayment.js
// Vercel Node.js Serverless Function (no frameworks needed)

import crypto from "crypto";
import fetch from "node-fetch";
import admin from "firebase-admin";

// ---- Firebase admin bootstrap (idempotent) ----
if (!admin.apps.length) {
  const svcJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svcJson) {
    console.error("FIREBASE_SERVICE_ACCOUNT env var is missing");
    // We still allow the function to load so that Vercel can build.
  } else {
    const serviceAccount = JSON.parse(svcJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
const db = admin.apps.length ? admin.firestore() : null;

// ---- Helper: read raw body for Razorpay signature verification ----
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// ---- Plan config (must match what you present to users in UI) ----
const PLAN_CATALOG = {
  starter: { amount: 10000, currency: "INR", maxUploads: 25, maxPrice: 199 },
  pro:     { amount: 30000, currency: "INR", maxUploads: 30, maxPrice: 249 },
  elite:   { amount: 80000, currency: "INR", maxUploads: 50, maxPrice: 249 },
};

// ---- Read Razorpay Order to recover notes/receipt ----
async function fetchOrder(orderId) {
  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const basic = Buffer.from(`${key}:${secret}`).toString("base64");

  const resp = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
    headers: { Authorization: `Basic ${basic}` },
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Razorpay order fetch failed ${resp.status}: ${txt}`);
  }
  return resp.json();
}

function expiryIn180Days() {
  const d = new Date();
  d.setDate(d.getDate() + 180);
  return admin.firestore.Timestamp.fromDate(d);
}

// ---- Handler ----
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res
      .status(500)
      .json({ ok: false, error: "Missing RAZORPAY_WEBHOOK_SECRET" });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (e) {
    return res.status(400).json({ ok: false, error: "Unable to read body" });
  }

  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return res.status(400).json({ ok: false, error: "Bad signature" });
  }

  // Signature passed – parse event
  let event;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch (e) {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
  }

  const type = event?.event || "";
  // We accept either payment.captured or order.paid (enable in Razorpay dashboard)
  const payment = event?.payload?.payment?.entity || null;

  try {
    if (!db) throw new Error("Firebase Admin not initialized");

    if (type === "payment.captured" && payment?.order_id) {
      const order = await fetchOrder(payment.order_id);

      // Strategy to identify the buyer/seller and plan:
      // - Prefer order.notes.{uid, planId}
      // - Fallback to parsing order.receipt if you encoded "seller_<uid>_<planId>_<ts>"
      const notes = order.notes || {};
      let uid = notes.uid || null;
      let planId = (notes.planId || notes.plan || "").toLowerCase();

      if ((!uid || !planId) && typeof order.receipt === "string") {
        // receipt like: seller_<uid>_<planId>_<timestamp>
        const parts = order.receipt.split("_");
        // ["seller", "<uid>", "<planId>", ...]
        if (parts.length >= 3) {
          uid = uid || parts[1];
          planId = planId || parts[2].toLowerCase();
        }
      }

      if (!uid || !PLAN_CATALOG[planId]) {
        // Don't fail the webhook; just log and return 200 so Razorpay doesn't retry forever.
        console.error("Webhook: could not resolve uid/planId", {
          uid,
          planId,
          orderId: order.id,
        });
        return res.status(200).json({ ok: true, warning: "Unknown uid/planId" });
      }

      const planMeta = PLAN_CATALOG[planId];

      // Persist seller subscription
      const sellerRef = db.collection("sellers").doc(uid);
      await sellerRef.set(
        {
          active: true,
          planId,
          planMeta,
          expiresAt: expiryIn180Days(),
          lastPayment: {
            paymentId: payment.id,
            orderId: order.id,
            amount: payment.amount, // in paise
            currency: payment.currency,
            capturedAt: admin.firestore.Timestamp.fromMillis(
              payment.captured_at ? payment.captured_at * 1000 : Date.now()
            ),
          },
        },
        { merge: true }
      );

      return res.status(200).json({ ok: true });
    }

    if (type === "order.paid") {
      // Optional: some teams prefer to act on order.paid instead.
      return res.status(200).json({ ok: true, info: "order.paid ignored" });
    }

    // Ignore other events safely.
    return res.status(200).json({ ok: true, info: "event ignored" });
  } catch (err) {
    console.error("Webhook error", err);
    // Still reply 200 so Razorpay doesn't spam retries; log for manual check.
    return res.status(200).json({ ok: false, error: "Handled with error" });
  }
}
