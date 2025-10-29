const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { amount, currency = "INR", notes = {} } = req.body || {};
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const order = await rzp.orders.create({
      amount,
      currency,
      notes,
      receipt: "rcpt_" + Date.now(),
    });
    res.status(200).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
