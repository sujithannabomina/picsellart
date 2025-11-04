// api/razorpay/webhook.js
// For production we recommend the Razorpay Dashboard points to your
// Firebase Function webhook. This file simply proxies (if FUNCTION_WEBHOOK_URL set)
// so you can also send test webhooks to Vercel if needed.

const https = require("https");

function proxyRaw(url, req) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const payload = Buffer.concat(chunks);
      const forward = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + (u.search || ""),
          method: "POST",
          port: 443,
          headers: {
            ...req.headers,
            host: u.hostname,
          },
        },
        (res) => {
          let body = "";
          res.on("data", (d) => (body += d));
          res.on("end", () => resolve({ status: res.statusCode, body }));
        }
      );
      forward.on("error", reject);
      forward.write(payload);
      forward.end();
    });
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const fnUrl = process.env.FUNCTION_WEBHOOK_URL;
    if (!fnUrl) {
      // If you didn't set a proxy, respond 200 so Razorpay doesn't retry noisily.
      console.warn("FUNCTION_WEBHOOK_URL not set. Returning 200 no-op.");
      return res.status(200).json({ ok: true, note: "No-op webhook handler" });
    }

    const result = await proxyRaw(fnUrl, req);
    return res.status(result.status || 200).send(result.body || "");
  } catch (err) {
    console.error("webhook proxy error:", err);
    return res.status(500).send("Webhook error");
  }
};
