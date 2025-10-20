// api/createOrder.js
// Vercel serverless function (Node.js 20)

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

// Locked plan prices (in paise) for seller renewals
const SELLER_PLANS = {
  starter: 100 * 100, // ₹100
  pro: 300 * 100,     // ₹300
  elite: 800 * 100,   // ₹800
};

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// Parse JSON body from Node req stream (no framework)
async function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function badRequest(res, msg) {
  res.statusCode = 400;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: msg }));
}

function methodNotAllowed(res) {
  res.statusCode = 405;
  res.setHeader("Allow", "POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Method not allowed" }));
}

export default async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") return methodNotAllowed(res);

  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      res.statusCode = 500;
      return res.end(
        JSON.stringify({ error: "Server not configured for Razorpay" })
      );
    }

    const body = await readJson(req);
    const {
      mode = "buyer", // "buyer" | "seller"
      amount,         // in paise (required for buyer)
      plan,           // "starter" | "pro" | "elite" (required for seller)
      currency = "INR",
      notes = {},
    } = body || {};

    let orderAmount;

    if (mode === "seller") {
      if (!plan || !SELLER_PLANS[plan]) {
        return badRequest(res, "Invalid or missing seller plan");
      }
      // Lock amount to server-side plan to prevent tampering
      orderAmount = SELLER_PLANS[plan];
    } else if (mode === "buyer") {
      if (!Number.isInteger(amount)) {
        return badRequest(res, "Amount (in paise) is required for buyer mode");
      }
      // Sanity guardrails (₹10 to ₹25,000)
      if (amount < 10 * 100 || amount > 25000 * 100) {
        return badRequest(res, "Amount out of allowed range");
      }
      orderAmount = amount;
    } else {
      return badRequest(res, "Invalid mode");
    }

    const auth = Buffer.from(
      `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const payload = {
      amount: orderAmount,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: { mode, plan: plan || "", ...notes },
    };

    const resp = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      // Razorpay error shape usually includes error.description
      const errMsg =
        data && data.error && data.error.description
          ? data.error.description
          : "Failed to create order";
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: errMsg }));
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    // Return only what the client needs to open checkout
    return res.end(
      JSON.stringify({
        order: {
          id: data.id,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          receipt: data.receipt,
          created_at: data.created_at,
        },
        key: RAZORPAY_KEY_ID, // public key for client checkout
      })
    );
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: err.message || "Server error" }));
  }
}
