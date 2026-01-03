import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { orderId, paymentId, signature } = req.body || {};
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: "Missing orderId/paymentId/signature" });
    }

    const body = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // ✅ Verified
    // Next step (after this): store purchase record in Firestore + allow original download
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "Verify failed", details: e?.message });
  }
}
