// api/razorpay/create-order.js
// Node serverless function (Vercel) that EITHER proxies to Cloud Function
// or directly creates an order with Razorpay (if keys provided).

const https = require("https");

// Lazy require only if needed (Mode B)
let RazorpayInstance = null;

async function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function proxyPostJson(url, json) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = Buffer.from(JSON.stringify(json));
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + (u.search || ""),
        method: "POST",
        port: 443,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": String(payload.length),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (d) => (body += d));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve({});
            }
          } else {
            reject(new Error(`Proxy ${res.statusCode}: ${body}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { amount, currency = "INR", receipt, customer = {} } = await readJson(req);
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Valid 'amount' (in rupees) is required" });
    }

    // Prefer proxy to your Cloud Function if provided
    const fnUrl = process.env.FUNCTION_CREATE_ORDER_URL;
    if (fnUrl) {
      const payload = { amount, currency, receipt, customer };
      const result = await proxyPostJson(fnUrl, payload);
      // Expect Cloud Function to return { order, key_id }
      return res.status(200).json(result);
    }

    // Fallback: create order directly in Vercel serverless
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return res.status(500).json({ error: "Server not configured for Razorpay" });
    }

    if (!RazorpayInstance) {
      const Razorpay = require("razorpay");
      RazorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }

    const order = await RazorpayInstance.orders.create({
      amount: Math.round(Number(amount) * 100), // paise
      currency,
      receipt: receipt || `psa_${Date.now()}`,
      notes: {
        customer_name: customer.name || "",
        customer_email: customer.email || "",
        customer_contact: customer.contact || "",
      },
    });

    return res.status(200).json({ order, key_id: keyId });
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: String(err.message || err) });
  }
};
