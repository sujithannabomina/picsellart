// FILE PATH: api/razorpay/webhook.js
import crypto from "crypto";
import { allowCors, requireMethod, sendJSON, nowISO } from "../_lib/utils.js";
import { getDb } from "../_lib/firebaseAdmin.js";

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (d) => chunks.push(d));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  try {
    if (allowCors(req, res)) return;
    if (!requireMethod(req, res, "POST")) return;

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return sendJSON(res, 500, { error: "Missing RAZORPAY_WEBHOOK_SECRET" });

    const db = getDb();
    const raw = await getRawBody(req);
    const sig = req.headers["x-razorpay-signature"];

    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (expected !== sig) return sendJSON(res, 400, { error: "Invalid webhook signature" });

    const event = JSON.parse(raw.toString("utf-8"));

    // Store webhook event for audit/debug
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    await db.collection("razorpayWebhooks").doc(id).set({
      id,
      event: event?.event || "",
      payload: event,
      createdAt: nowISO(),
    });

    return sendJSON(res, 200, { ok: true });
  } catch (e) {
    console.error("webhook error:", e?.message || e);
    return sendJSON(res, 500, { error: e?.message || "Webhook failed" });
  }
}
