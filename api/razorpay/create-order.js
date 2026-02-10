// FILE PATH: api/razorpay/create-order.js
const { getRazorpay } = require("./razorpay");
const { getDb } = require("../_lib/firebaseAdmin");

function json(res, code, data) {
  res.status(code).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function normalizeStoragePath(p) {
  const s = String(p || "");
  // Your old flow sometimes sends: sample-public/images/sample1.jpg
  if (s.startsWith("sample-public/")) return s.replace(/^sample-public\//, "public/");
  return s;
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

    const body = req.body || {};
    const buyerUid = String(body.buyerUid || "");
    const amountINR = Number(body.amountINR);
    const photo = body.photo || {};

    if (!buyerUid) return json(res, 400, { error: "Missing buyerUid" });
    if (!Number.isFinite(amountINR) || amountINR <= 0) return json(res, 400, { error: "Invalid amountINR" });

    const photoId = String(photo.id || "");
    const fileName = String(photo.fileName || "");
    const displayName = String(photo.displayName || "Photo");
    const storagePath = normalizeStoragePath(photo.storagePath || photoId || "");
    const currency = "INR";

    if (!storagePath) return json(res, 400, { error: "Missing photo storagePath" });

    const amountPaise = Math.round(amountINR * 100);
    const receipt = `psa_${buyerUid.slice(0, 8)}_${Date.now()}`;

    const rz = getRazorpay();

    const order = await rz.orders.create({
      amount: amountPaise,
      currency,
      receipt,
      payment_capture: 1,
      notes: {
        purpose: "buyer_purchase",
        buyerUid,
        photoId: photoId || storagePath,
        fileName,
        displayName,
        storagePath,
      },
    });

    // Firestore log (server-side)
    const db = getDb();
    await db.collection("orders").doc(order.id).set(
      {
        orderId: order.id,
        buyerUid,
        amountINR,
        amountPaise,
        currency,
        receipt,
        status: order.status || "created",
        photo: {
          id: photoId || storagePath,
          fileName,
          displayName,
          storagePath,
        },
        createdAt: new Date().toISOString(),
        source: "vercel_api",
      },
      { merge: true }
    );

    return json(res, 200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
    });
  } catch (e) {
    return json(res, 500, { error: e?.message || "Server error" });
  }
};
