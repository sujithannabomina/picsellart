// /api/createOrder.js
import Razorpay from "razorpay";
import crypto from "crypto";
import { adminDb, adminTimestamp } from "./_firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      amount,          // in paise
      currency,        // "INR"
      userId,          // auth uid
      purchaseType,    // "plan" | "photo"
      planId,          // for purchaseType === "plan"
      photoId,         // for purchaseType === "photo"
      sellerId,        // for purchaseType === "photo"
      title,           // optional, display title
      isSample         // boolean (true if Picsellart-owned sample)
    } = req.body || {};

    if (!amount || !currency || !userId) {
      return res.status(400).json({ error: "amount, currency, userId required" });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      return res.status(500).json({ error: "Razorpay keys missing" });
    }

    const instance = new Razorpay({ key_id, key_secret });

    // Create an order in Razorpay
    const order = await instance.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        purchaseType: purchaseType || (planId ? "plan" : "photo"),
        planId: planId || "",
        photoId: photoId || "",
        sellerId: sellerId || "",
        title: title || "",
        isSample: isSample ? "true" : "false",
      },
    });

    // Save a pending order in Firestore for bookkeeping (optional but helpful)
    await adminDb.collection("orders").doc(order.id).set({
      orderId: order.id,
      amount,
      currency,
      status: "created",
      userId,
      purchaseType: purchaseType || (planId ? "plan" : "photo"),
      planId: planId || null,
      photoId: photoId || null,
      sellerId: sellerId || null,
      title: title || null,
      isSample: !!isSample,
      createdAt: adminTimestamp.now(),
    });

    // Return order to client (include planId so client can use it later)
    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: planId || null,
      photoId: photoId || null,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ error: "createOrder failed" });
  }
}
