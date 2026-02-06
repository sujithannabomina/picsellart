// FILE PATH: api/razorpay/webhook.js
import crypto from "crypto";
import { db } from "../../src/lib/firebaseAdmin.js";

function verifySignature(rawBody, signature, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).send("Method not allowed");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(500).send("Missing RAZORPAY_WEBHOOK_SECRET");

    const signature = req.headers["x-razorpay-signature"];
    if (!signature) return res.status(400).send("Missing signature");

    const raw = JSON.stringify(req.body || {});
    if (!verifySignature(raw, signature, secret)) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body?.event;
    const payload = req.body?.payload || {};

    if (event && event.startsWith("subscription.")) {
      const sub = payload.subscription?.entity;

      if (sub?.id) {
        await db.collection("subscriptions").doc(sub.id).set(
          {
            subscriptionId: sub.id,
            status: sub.status,
            current_start: sub.current_start,
            current_end: sub.current_end,
            charge_at: sub.charge_at,
            updatedAt: new Date().toISOString(),
            rawEvent: event,
          },
          { merge: true }
        );

        const sellerUid = sub.notes?.sellerUid;
        const planId = sub.notes?.planId;

        if (sellerUid) {
          let sellerStatus = "active";
          if (sub.status === "cancelled") sellerStatus = "cancelled";
          if (sub.status === "paused") sellerStatus = "paused";

          await db.collection("sellers").doc(sellerUid).set(
            {
              uid: sellerUid,
              planId: planId || null,
              subscriptionId: sub.id,
              subscriptionStatus: sub.status,
              status: sellerStatus,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      }
    }

    return res.status(200).send("ok");
  } catch (e) {
    return res.status(500).send(e?.message || "Webhook error");
  }
}
