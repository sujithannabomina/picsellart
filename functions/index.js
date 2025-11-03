// functions/index.js
// Node 20, ESM ("type": "module"). Firebase 2nd-gen HTTPS functions.
// Endpoints:
//   - POST https://<region>-<project>.cloudfunctions.net/createOrder    (via Cloud Run URL shown after deploy)
//   - POST https://<region>-<project>.cloudfunctions.net/webhook
//
// What it does:
// 1) createOrder: creates a Razorpay Order with required notes (uid, planId, email)
// 2) webhook: verifies signature, processes payment/order events idempotently,
//    and activates the seller subscription in Firestore.
//
// Required secrets (already set in your project via `functions:config:set` or env):
//   - razorpay.key_id
//   - razorpay.key_secret
//   - razorpay.webhook_secret
//
// Firestore writes (all in one transaction):
//   - users/{uid}:
//       subscription: { planId, planLabel, priceINR, maxUploads, maxPricePerImage, days, expiresAt, active }
//       uploadsRemaining
//       payment: { paymentId, orderId, amountINR, status, method, email, createdAt }
//       updatedAt
//   - payments/{paymentId}: { processedAt, eventType, orderId, uid }   // for idempotency

import { onRequest, setGlobalOptions, logger } from "firebase-functions/v2/https";
import * as functions from "firebase-functions"; // for functions.config() (legacy env)
import Razorpay from "razorpay";
import crypto from "crypto";

import { initializeApp } from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  FieldValue,
} from "firebase-admin/firestore";

initializeApp();
setGlobalOptions({
  region: "asia-south1",
  timeoutSeconds: 60,
  memory: "256MiB",
});

const cfg = functions.config?.() || {};
const RZP_KEY_ID =
  process.env.RAZORPAY_KEY_ID || cfg.razorpay?.key_id || "";
const RZP_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || cfg.razorpay?.key_secret || "";
const RZP_WEBHOOK_SECRET =
  process.env.RAZORPAY_WEBHOOK_SECRET || cfg.razorpay?.webhook_secret || "";

if (!RZP_KEY_ID || !RZP_KEY_SECRET || !RZP_WEBHOOK_SECRET) {
  logger.error("Razorpay secrets missing. Set via functions:config:set or env.");
}

const razorpay = new Razorpay({
  key_id: RZP_KEY_ID,
  key_secret: RZP_KEY_SECRET,
});

const db = getFirestore();

/** Our canonical plan table (must match the frontend PLANS) */
const PLAN_TABLE = {
  starter: {
    id: "starter",
    label: "Starter",
    priceINR: 100,
    maxUploads: 25,
    maxPricePerImage: 199,
    days: 180,
  },
  pro: {
    id: "pro",
    label: "Pro",
    priceINR: 300,
    maxUploads: 30,
    maxPricePerImage: 249,
    days: 180,
  },
  elite: {
    id: "elite",
    label: "Elite",
    priceINR: 800,
    maxUploads: 50,
    maxPricePerImage: 249,
    days: 180,
  },
};

/** Utility: INR → paise (int) */
const toPaise = (inr) => Math.round(Number(inr) * 100);

/** Utility: returns plan by id or throws */
function getPlanOrThrow(planId) {
  const plan = PLAN_TABLE[planId];
  if (!plan) throw new Error(`Unknown planId '${planId}'`);
  return plan;
}

/** POST /createOrder
 *  Body: { planId: "starter"|"pro"|"elite", uid: string, email?: string, name?: string }
 *  Returns: { orderId, amount, currency, key }
 */
export const createOrder = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { planId, uid, email = "", name = "" } = req.body || {};
    if (!planId || !uid) {
      return res.status(400).json({ error: "Missing planId or uid" });
    }

    const plan = getPlanOrThrow(planId);

    const order = await razorpay.orders.create({
      amount: toPaise(plan.priceINR),
      currency: "INR",
      receipt: `pl_${planId}_${uid}_${Date.now()}`,
      notes: {
        uid,
        planId,
        email,
        name,
        priceINR: String(plan.priceINR),
      },
    });

    logger.info("Order created", { orderId: order.id, uid, planId });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RZP_KEY_ID, // used by frontend Razorpay Checkout
    });
  } catch (err) {
    logger.error("createOrder failed", err);
    return res.status(500).json({ error: "Failed to create order" });
  }
});

/** Verify Razorpay signature with raw body (required for security) */
function verifySignature(rawBody, receivedSignature) {
  const expected = crypto
    .createHmac("sha256", RZP_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSignature));
}

/** Map incoming Razorpay payload into normalized fields we care about */
function extractPaymentContext(parsed) {
  const et = parsed?.event || "";
  // Prefer payment.* payload for richer details, but keep order.* as fallback.
  const payment = parsed?.payload?.payment?.entity || {};
  const order = parsed?.payload?.order?.entity || {};

  const orderId = payment?.order_id || order?.id || "";
  const paymentId = payment?.id || "";
  const email = payment?.email || payment?.contact || "";
  const status = payment?.status || order?.status || "";
  const method = payment?.method || "";
  const amountPaise =
    typeof payment?.amount === "number"
      ? payment.amount
      : typeof order?.amount === "number"
      ? order.amount
      : 0;

  // notes should carry uid and planId from createOrder
  const notes = payment?.notes || order?.notes || {};
  const uid = notes.uid || "";
  const planId = notes.planId || "";

  return {
    eventType: et,
    orderId,
    paymentId,
    email,
    method,
    status,
    amountINR: Math.round((amountPaise || 0) / 100),
    uid,
    planId,
    notes,
  };
}

/** POST /webhook
 * Handles: payment.captured, payment.authorized, payment.failed, order.paid, order.payment_failed
 * Safe for retries (idempotent) using payments/{paymentId}.
 */
export const webhook = onRequest({ cors: false }, async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    const signature = req.get("x-razorpay-signature") || "";
    const rawBody = req.rawBody; // Firebase provides Buffer
    if (!signature || !rawBody) {
      logger.warn("Missing signature/rawBody");
      return res.status(400).send("Bad Request");
    }

    // Verify HMAC
    if (!verifySignature(rawBody, signature)) {
      logger.warn("Invalid webhook signature");
      return res.status(401).send("Invalid signature");
    }

    const payload = JSON.parse(rawBody.toString("utf8"));
    const ctx = extractPaymentContext(payload);

    logger.info("Webhook verified", {
      event: ctx.eventType,
      orderId: ctx.orderId,
      paymentId: ctx.paymentId,
      uid: ctx.uid,
      planId: ctx.planId,
      status: ctx.status,
      amountINR: ctx.amountINR,
    });

    // Only act on success events
    const successEvent =
      ctx.eventType === "payment.captured" || ctx.eventType === "order.paid";

    // Guard: need uid & planId from notes (supplied by createOrder)
    if (!ctx.uid || !ctx.planId) {
      logger.error("Missing uid/planId in notes; cannot activate plan", {
        orderId: ctx.orderId,
        paymentId: ctx.paymentId,
      });
      // Acknowledge anyway so Razorpay doesn't retry forever.
      return res.status(200).send("ok");
    }

    // Idempotency: if we've already processed this paymentId, do nothing
    if (ctx.paymentId) {
      const payDocRef = db.collection("payments").doc(ctx.paymentId);
      const paySnap = await payDocRef.get();
      if (paySnap.exists) {
        logger.info("Payment already processed, skipping", {
          paymentId: ctx.paymentId,
        });
        return res.status(200).send("ok");
      }
    }

    // Determine plan from planId (source of truth)
    const plan = getPlanOrThrow(ctx.planId);

    // Compute expiry
    const now = Timestamp.now();
    const expiresAt = Timestamp.fromMillis(
      now.toMillis() + plan.days * 24 * 60 * 60 * 1000
    );

    // Firestore writes
    const userRef = db.collection("users").doc(ctx.uid);
    const payDocRef =
      ctx.paymentId
        ? db.collection("payments").doc(ctx.paymentId)
        : db.collection("payments").doc(`order_${ctx.orderId}_${Date.now()}`);

    await db.runTransaction(async (trx) => {
      const userSnap = await trx.get(userRef);
      const existing = userSnap.data() || {};

      // Update subscription only on success; on failures, just log payment
      if (successEvent) {
        const subscription = {
          planId: plan.id,
          planLabel: plan.label,
          priceINR: plan.priceINR,
          maxUploads: plan.maxUploads,
          maxPricePerImage: plan.maxPricePerImage,
          days: plan.days,
          expiresAt,
          active: true,
        };

        trx.set(
          userRef,
          {
            subscription,
            uploadsRemaining: plan.maxUploads,
            payment: {
              paymentId: ctx.paymentId || null,
              orderId: ctx.orderId || null,
              amountINR: ctx.amountINR,
              status: ctx.status || "captured",
              method: ctx.method || null,
              email: ctx.email || existing?.email || null,
              createdAt: now,
            },
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      // Always write the payment doc for audit/idempotency
      trx.set(payDocRef, {
        processedAt: now,
        eventType: ctx.eventType,
        orderId: ctx.orderId,
        paymentId: ctx.paymentId || null,
        uid: ctx.uid,
        planId: ctx.planId,
        amountINR: ctx.amountINR,
        status: ctx.status,
        raw: payload, // keep full payload for reconciliation
      });
    });

    return res.status(200).send("ok");
  } catch (err) {
    logger.error("webhook handler error", err);
    // Always 200 to avoid retries storm, but log error for investigation
    return res.status(200).send("ok");
  }
});
