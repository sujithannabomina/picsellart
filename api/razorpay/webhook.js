// FILE PATH: api/razorpay/webhook.js
const crypto = require("crypto");
const { setCors, send } = require("../_lib/utils");
const { getDb } = require("../_lib/firebaseAdmin");

async function readRaw(req) {
  return await new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
  });
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    if (!secret) return send(res, 200, { ok: true, note: "No webhook secret set; ignoring." });

    const raw = await readRaw(req);
    const sig = req.headers["x-razorpay-signature"] || "";

    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (expected !== sig) return send(res, 400, { error: "Invalid webhook signature" });

    const payload = JSON.parse(raw || "{}");

    // Store webhook for audit (optional)
    const db = getDb();
    await db.collection("razorpay_webhooks").add({
      payload,
      createdAt: new Date().toISOString(),
    });

    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { error: e?.message || "Webhook error" });
  }
};
