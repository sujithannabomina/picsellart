// /api/verifyPayment.js
const crypto = require('crypto')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex')

    const valid = expected === razorpay_signature
    res.status(200).json({ valid })
  } catch (err) {
    console.error('verifyPayment error:', err)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
}
