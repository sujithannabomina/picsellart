// /api/verifyPayment.js
import crypto from "crypto";
import { adminDb, adminFieldValue, adminTimestamp } from "./_firebaseAdmin.js";

const PLAN_MAP = {
  starter: { uploads: 25, maxPrice: 199, days: 180, priceINR: 100 },
  pro:     { uploads: 30, maxPrice: 249, days: 180, priceINR: 300 },
  elite:   { uploads: 50, maxPrice: 249, days: 180, priceINR: 800 },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { order_id, payment_id, signature, userId, planId } = req.body || {};
    if (!order_id || !payment_id || !signature || !userId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Razorpay secret missing" });
    }

    // Verify signature
    const payload = `${order_id}|${payment_id}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const valid = expected === signature;
    if (!valid) {
      // mark order failed
      await adminDb.collection("orders").doc(order_id).set({
        orderId: order_id,
        paymentId: payment_id,
        verified: false,
        status: "failed",
        verifiedAt: adminTimestamp.now(),
      }, { merge: true });
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    // Fetch the order doc to know purchaseType/metadata
    const ordRef = adminDb.collection("orders").doc(order_id);
    const ordSnap = await ordRef.get();
    if (!ordSnap.exists) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    const ord = ordSnap.data();

    // Mark order as paid
    await ordRef.set({
      status: "paid",
      paymentId: payment_id,
      verified: true,
      verifiedAt: adminTimestamp.now(),
    }, { merge: true });

    // Apply side-effects
    if (ord.purchaseType === "plan") {
      const plan = PLAN_MAP[ord.planId];
      if (!plan) {
        return res.status(400).json({ success: false, error: "Unknown plan" });
      }

      const expiresAt = adminTimestamp.fromMillis(Date.now() + plan.days * 24 * 60 * 60 * 1000);
      const sellerRef = adminDb.collection("sellers").doc(userId);
      await sellerRef.set({
        planId: ord.planId,
        maxPrice: plan.maxPrice,
        uploadLimit: plan.uploads,
        expiresAt,
        updatedAt: adminTimestamp.now(),
      }, { merge: true });

      return res.status(200).json({ success: true, type: "plan", planId: ord.planId });
    } else {
      // Photo purchase
      const buyerRef = adminDb.collection("buyers").doc(userId);
      const purchasesRef = buyerRef.collection("purchases").doc(order_id);

      await purchasesRef.set({
        orderId: order_id,
        paymentId: payment_id,
        photoId: ord.photoId,
        sellerId: ord.sellerId,
        title: ord.title || "Photo",
        amount: ord.amount,
        currency: ord.currency,
        createdAt: adminTimestamp.now(),
      });

      // Optional seller revenue ledger
      if (ord.sellerId && ord.sellerId !== "picsellart") {
        await adminDb.collection("sellers").doc(ord.sellerId)
          .collection("sales").doc(order_id).set({
            orderId: order_id,
            paymentId: payment_id,
            buyerId: userId,
            photoId: ord.photoId,
            amount: ord.amount,
            currency: ord.currency,
            createdAt: adminTimestamp.now(),
          });
      }

      return res.status(200).json({ success: true, type: "photo", photoId: ord.photoId });
    }
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ success: false, error: "verifyPayment failed" });
  }
}
