// api/razorpay/create-order.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const CREATE_ORDER_URL =
      process.env.CREATE_ORDER_URL ||
      "https://createorder-o67lgxsola-el.a.run.app";

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // minimal validation
    const amount = Number(body?.amount);
    if (!amount || amount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Forward Authorization if you send Firebase ID token from frontend
    const auth = req.headers.authorization || "";

    const resp = await fetch(CREATE_ORDER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));

    return res.status(resp.status).json(data);
  } catch (err) {
    console.error("create-order proxy error:", err);
    return res.status(500).json({ error: "create-order failed" });
  }
}
