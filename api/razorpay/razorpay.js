// FILE: api/razorpay.js
const crypto = require("crypto");

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return json(res, 500, { error: "Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET env vars on server" });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const action = url.searchParams.get("action");

    let body = "";
    await new Promise((r) => {
      req.on("data", (c) => (body += c));
      req.on("end", r);
    });
    const data = body ? JSON.parse(body) : {};

    if (action === "createOrder") {
      const amount = Number(data.amount || 0);
      const currency = data.currency || "INR";
      const receipt = data.receipt || `rcpt_${Date.now()}`;
      const notes = data.notes || {};

      if (!amount || amount < 1) return json(res, 400, { error: "Invalid amount" });

      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

      const resp = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ amount, currency, receipt, notes }),
      });

      const order = await resp.json();
      if (!resp.ok) return json(res, 400, { error: order });

      return json(res, 200, { order });
    }

    if (action === "verifyPayment") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return json(res, 400, { error: "Missing verification fields" });
      }

      const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto.createHmac("sha256", keySecret).update(signBody).digest("hex");

      return json(res, 200, { verified: expected === razorpay_signature });
    }

    return json(res, 404, { error: "Unknown action" });
  } catch (e) {
    return json(res, 500, { error: e.message || "Server error" });
  }
};
