// /api/razorpayWebhook.js
import crypto from "crypto";
import { adminDb, adminTimestamp } from "./_firebaseAdmin.js";

export const config = {
  api: {
    bodyParser: false, // we need raw body to verify signature
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);
    req.on("data", (chunk) => { data = Buffer.concat([data, chunk]); });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(500).send("Webhook secret missing");

    const raw = await getRawBody(req);
    const signature = req.headers["x-razorpay-signature"];

    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (expected !== signature) return res.status(400).send("Invalid signature");

    const event = JSON.parse(raw.toString());
    // Store the event for audit
    await adminDb.collection("webhooks").doc(event.id || `evt_${Date.now()}`).set({
      receivedAt: adminTimestamp.now(),
      event,
    });

    // You can optionally hydrate order status here based on event.type
    // e.g., payment.captured => mark order paid (id from event.payload.payment.entity.order_id)
    return res.status(200).send("OK");
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).send("Server Error");
  }
}
