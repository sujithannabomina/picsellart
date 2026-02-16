// functions/index.js
import corsPkg from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();

// IMPORTANT: set your allowed origins (add both with/without www)
const ALLOWED_ORIGINS = new Set([
  "https://picsellart.com",
  "https://www.picsellart.com",
]);

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const cors = corsPkg({
  origin: (origin, cb) => {
    // allow non-browser tools too (no origin)
    if (!origin) return cb(null, true);
    return cb(null, ALLOWED_ORIGINS.has(origin));
  },
});

const REGION = "asia-south1";

const RAZORPAY_KEY_ID = defineSecret("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineSecret("RAZORPAY_KEY_SECRET");
const RAZORPAY_WEBHOOK_SECRET = defineSecret("RAZORPAY_WEBHOOK_SECRET");

function getRazorpayClient() {
  const key_id = RAZORPAY_KEY_ID.value();
  const key_secret = RAZORPAY_KEY_SECRET.value();
  if (!key_id || !key_secret) throw new Error("Missing Razorpay secrets");
  return new Razorpay({ key_id, key_secret });
}

export const createOrder = onRequest(
  {
    region: REGION,
    secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET],
    invoker: "public", // ✅ makes it callable from browser
  },
  (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");

    cors(req, res, async () => {
      try {
        if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

        const { amount, currency = "INR", itemId, buyerUid, type = "image" } = req.body || {};
        const amtINR = Number(amount);

        if (!Number.isFinite(amtINR) || amtINR < 1) return res.status(400).json({ error: "Invalid amount" });
        if (!itemId) return res.status(400).json({ error: "Missing itemId" });
        if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });

        const razorpay = getRazorpayClient();

        // ✅ FIX: Shortened receipt to stay under 40 chars (Razorpay limit)
        // Changed from: `psa_${buyerUid}_${Date.now()}` (too long)
        // To: `psa${Date.now()}` (under 40 chars)
        const order = await razorpay.orders.create({
          amount: Math.round(amtINR * 100),
          currency,
          receipt: `psa${Date.now()}`,
          notes: { itemId, buyerUid, type },
        });

        return res.status(200).json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      } catch (err) {
        console.error("createOrder error:", err);
        return res.status(500).json({ error: err?.message || "create-order failed" });
      }
    });
  }
);

export const verifyPayment = onRequest(
  {
    region: REGION,
    secrets: [RAZORPAY_KEY_SECRET],
    invoker: "public", // ✅ callable from browser
  },
  (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");

    cors(req, res, async () => {
      try {
        if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, itemId, buyerUid, amount } = req.body || {};

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ error: "Missing Razorpay fields" });
        }
        if (!itemId || !buyerUid) return res.status(400).json({ error: "Missing itemId/buyerUid" });

        const key_secret = RAZORPAY_KEY_SECRET.value();
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expected = crypto.createHmac("sha256", key_secret).update(body).digest("hex");

        if (expected !== razorpay_signature) return res.status(400).json({ error: "Signature mismatch" });

        const db = getFirestore();
        const purchaseId = `${buyerUid}_${razorpay_order_id}`;

        await db.collection("purchases").doc(purchaseId).set(
          {
            buyerUid,
            itemId,
            amount: Number(amount) || null,
            razorpay: { orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature },
            createdAt: FieldValue.serverTimestamp(),
            status: "paid",
          },
          { merge: true }
        );

        return res.status(200).json({ ok: true });
      } catch (err) {
        console.error("verifyPayment error:", err);
        return res.status(500).json({ error: err?.message || "verify-payment failed" });
      }
    });
  }
);

export const webhook = onRequest(
  {
    region: REGION,
    secrets: [RAZORPAY_WEBHOOK_SECRET],
    invoker: "public",
  },
  async (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") return res.status(204).send("");
    return res.status(200).json({ ok: true });
  }
);
