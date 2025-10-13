// /api/createOrder.js
const Razorpay = require('razorpay')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {}
    if (!amount) {
      res.status(400).json({ error: 'amount is required (in paise)' })
      return
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await instance.orders.create({
      amount,
      currency,
      receipt: receipt ?? `rcpt_${Date.now()}`,
      notes: notes ?? {},
    })

    res.status(200).json(order)
  } catch (err) {
    console.error('createOrder error:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
}
