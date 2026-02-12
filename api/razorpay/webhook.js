import crypto from "node:crypto";
import { bad, ok, readRawBody } from "../_lib/utils.js";
import { getWebhookSecret } from "./_lib/razorpay.js";
import { getDb } from "../_lib/firebaseAdmin.js";

function verifyWebhookSignature(rawBody, signature, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  try {
    const secret = getWebhookSecret();
    if (!secret) return bad(res, 500, "Missing RAZORPAY_WEBHOOK_SECRET");

    const signature = req.headers["x-razorpay-signature"];
    if (!signature) return bad(res, 400, "Missing webhook signature");

    const raw = await readRawBody(req);
    const isValid = verifyWebhookSignature(raw, signature, secret);
    if (!isValid) return bad(res, 400, "Invalid webhook signature");

    const payload = JSON.parse(raw.toString("utf-8"));

    const db = getDb();
    await db.collection("webhooks").add({
      createdAt: Date.now(),
      event: payload?.event || "",
      payload
    });

    return ok(res, { received: true });
  } catch (e) {
    return bad(res, 500, e?.message || "webhook failed");
  }
}
