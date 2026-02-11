// FILE PATH: api/razorpay/_lib/razorpay.js
const Razorpay = require("razorpay");

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id) throw new Error("Missing RAZORPAY_KEY_ID env var.");
  if (!key_secret) throw new Error("Missing RAZORPAY_KEY_SECRET env var.");

  return new Razorpay({ key_id, key_secret });
}

module.exports = { getRazorpay };
