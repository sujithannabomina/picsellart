// api/createOrder.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(500).json({ error: "Razorpay env vars missing" });
    return;
  }

  try {
    const body = req.body || {};
    const mode = body.mode;

    let amount = 0; // paise
    let notes = {};
    if (mode === "buyer") {
      // client sends amount in paise; clamp just to be safe
      const a = Number(body.amount || 0);
      if (!Number.isFinite(a) || a < 1000 || a > 5000000) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      amount = Math.floor(a);
      notes = body.notes || {};
    } else if (mode === "seller") {
      // server-enforced prices
      const plan = String(body.plan || "");
      const PLAN_PRICES = {
        starter: 10000, // ₹100
        pro: 30000,     // ₹300
        elite: 80000,   // ₹800
      };
      if (!PLAN_PRICES[plan]) {
        return res.status(400).json({ error: "Invalid plan" });
      }
      amount = PLAN_PRICES[plan];
      notes = { plan };
    } else {
      return res.status(400).json({ error: "Invalid mode" });
    }

    // Create order via Razorpay REST
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const resp = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(500).json({ error: "Razorpay order failed", detail: err });
    }

    const order = await resp.json();
    res.status(200).json({ order, key: keyId });
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: e?.message || String(e) });
  }
}
