// api/razorpay/webhook.js
// Verifies Razorpay webhook signatures and acknowledges events.

/** Use Node runtime, not nodejs18.x */
module.exports.config = { runtime: "nodejs" };

const crypto = require("crypto");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({ error: "Missing webhook secret" });
    }

    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body || {});
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expected) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // TODO: handle events as needed (order.paid, payment.captured, etc.)
    // Example:
    // if (req.body?.event === "payment.captured") { ... }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).json({ error: "Webhook failed", details: err?.message });
  }
};
