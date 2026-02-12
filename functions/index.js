// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import Razorpay from "razorpay";
import CryptoJS from "crypto-js";

setGlobalOptions({ region: "asia-south1" });

initializeApp();
const db = getFirestore();

// ====== REQUIRED ENV on Firebase Functions runtime ======
// RAZORPAY_KEY_ID
// RAZORPAY_KEY_SECRET
// RAZORPAY_WEBHOOK_SECRET
//
// Set them in Firebase console:
// Firebase -> Functions -> (your function) -> Runtime environment variables
// or via CLI if you use it.

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Missing Razorpay server env (RAZORPAY_KEY_ID/SECRET)");
  }

  return new Razorpay({ key_id, key_secret });
}

function cors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export const createorder = onRequest(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const razorpay = getRazorpay();

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const amount = Number(body?.amount); // amount in rupees or paise? we'll standardize to paise below
    const currency = body?.currency || "INR";

    // IMPORTANT: Razorpay expects amount in paise for INR.
    // If your UI sends rupees (e.g., 169), convert to paise:
    const amount_paise = Number.isInteger(amount) ? Math.round(amount * 100) : Math.round(Number(amount) * 100);
    if (!amount_paise || amount_paise < 100) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const imageId = body?.imageId || null; // what user is buying
    const buyerUid = body?.buyerUid || null; // optional

    const receipt = body?.receipt || `rcpt_${Date.now()}`;

    const notes = {
      ...(imageId ? { imageId: String(imageId) } : {}),
      ...(buyerUid ? { buyerUid: String(buyerUid) } : {}),
      ...(body?.notes && typeof body.notes === "object" ? body.notes : {}),
    };

    const order = await razorpay.orders.create({
      amount: amount_paise,
      currency,
      receipt,
      notes,
    });

    // Optional: store a pending order in Firestore
    await db.collection("orders").doc(order.id).set(
      {
        status: "created",
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes || {},
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Send key_id back to client (safe), never send key_secret
    return res.status(200).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      notes: order.notes || {},
    });
  } catch (err) {
    console.error("createorder error:", err);
    return res.status(500).json({ error: "create-order failed" });
  }
});

export const webhook = onRequest(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error("Missing RAZORPAY_WEBHOOK_SECRET");

    const signature = req.headers["x-razorpay-signature"];
    const rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    // Verify signature
    const expected = CryptoJS.HmacSHA256(rawBody, webhookSecret).toString();
    if (!signature || signature !== expected) {
      console.error("Webhook signature mismatch");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const event = payload?.event || "";
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    const paymentId = paymentEntity?.id || null;
    const orderId = paymentEntity?.order_id || orderEntity?.id || null;
    const status = paymentEntity?.status || null;

    if (!orderId) {
      return res.status(200).json({ ok: true, note: "No order_id in webhook" });
    }

    // Update Firestore order status
    await db.collection("orders").doc(orderId).set(
      {
        status: status || event || "updated",
        paymentId: paymentId || null,
        event,
        updatedAt: FieldValue.serverTimestamp(),
        raw: payload,
      },
      { merge: true }
    );

    // Optional: create buyer purchase record if payment captured
    if (status === "captured") {
      const notes = paymentEntity?.notes || {};
      await db.collection("purchases").add({
        orderId,
        paymentId,
        amount: paymentEntity?.amount,
        currency: paymentEntity?.currency,
        buyerUid: notes?.buyerUid || null,
        imageId: notes?.imageId || null,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).json({ error: "webhook failed" });
  }
});
