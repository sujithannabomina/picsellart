import Razorpay from "razorpay";
import crypto from "crypto";

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { action } = req.query;

    // Basic env checks
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({ error: "Missing Razorpay env vars" });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // ----------------------------
    // 1) CREATE ORDER
    // ----------------------------
    if (action === "createOrder") {
      const { amount, currency = "INR", receipt } = req.body || {};

      // amount must be in paise
      const amt = Number(amount);
      if (!amt || amt < 1) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const order = await razorpay.orders.create({
        amount: amt,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      });

      return res.status(200).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId, // safe to send key_id to client
      });
    }

    // ----------------------------
    // 2) VERIFY PAYMENT
    // ----------------------------
    if (action === "verifyPayment") {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body || {};

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({ error: "Missing payment fields" });
      }

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");

      const isValid = expectedSignature === razorpay_signature;

      if (!isValid) {
        return res.status(400).json({ success: false, error: "Invalid signature" });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error("Razorpay API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
