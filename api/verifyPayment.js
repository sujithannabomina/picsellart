// /api/verifyPayment.js
import crypto from 'crypto'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, meta = {} } = req.body || {}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing parameters' })
    }
    const secret = process.env.RAZORPAY_KEY_SECRET
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const expected = hmac.digest('hex')

    if (expected !== razorpay_signature) return res.status(400).json({ ok: false, error: 'Invalid signature' })
    res.status(200).json({ ok: true, payment: { razorpay_order_id, razorpay_payment_id }, meta })
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Server error' })
  }
}
