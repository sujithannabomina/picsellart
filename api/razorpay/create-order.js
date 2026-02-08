// FILE PATH: api/razorpay/create-order.js
const { getRazorpay } = require("./razorpay");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { amountINR, buyerUid, type, photoId, storagePath, fileName } = req.body || {};

    if (!buyerUid) return res.status(400).json({ error: "Missing buyerUid" });

    const amount = Math.round(Number(amountINR || 0) * 100);
    if (!amount || amount < 100) return res.status(400).json({ error: "Invalid amount" });

    const rz = getRazorpay();

    const receipt = `buy_${buyerUid.slice(0, 8)}_${Date.now()}`;

    const order = await rz.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        purpose: "photo_purchase",
        buyerUid,
        type: type || "sample",
        photoId: photoId || "",
        storagePath: storagePath || "",
        fileName: fileName || "",
      },
    });

    return res.status(200).json({
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
};
