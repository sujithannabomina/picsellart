// FILE PATH: api/razorpay/razorpay.js
const Razorpay = require("razorpay");

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Missing Razorpay server keys. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.");
  }

  return new Razorpay({ key_id, key_secret });
}

module.exports = { getRazorpay };
