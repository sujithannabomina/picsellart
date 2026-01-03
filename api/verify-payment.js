// api/verify-payment.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return res.status(500).json({ error: "Missing RAZORPAY_KEY_SECRET" });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: "Signature verification failed" });
    }

    // At this stage payment is verified.
    // Next: store purchase in Firestore (we can add in next step once login/dashboard is stable)
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Verification failed" });
  }
}
