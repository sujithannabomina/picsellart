// api/razorpay/create-order.js

export default async function handler(req, res) {
  try {
    // CORS (basic)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const CREATE_ORDER_URL = process.env.CREATE_ORDER_URL;
    if (!CREATE_ORDER_URL) {
      return res.status(500).json({ error: "Missing CREATE_ORDER_URL env" });
    }

    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const r = await fetch(CREATE_ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(r.status).json(data);
  } catch (e) {
    console.error("proxy create-order error:", e);
    return res.status(500).json({ error: "create-order failed" });
  }
}
