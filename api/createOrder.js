// /api/createOrder.js
import crypto from 'crypto'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const { purpose, amount, currency = 'INR', meta = {} } = req.body || {}
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay env missing' })
    }
    if (!amount || amount < 1) return res.status(400).json({ error: 'Invalid amount' })
    if (!['purchase', 'subscription'].includes(purpose)) return res.status(400).json({ error: 'Invalid purpose' })

    // Create order
    const body = JSON.stringify({
      amount: Math.round(Number(amount) * 100), // paise
      currency,
      receipt: `${purpose}-${Date.now()}`,
      notes: meta || {},
    })

    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')
    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${auth}` },
      body,
    })
    const data = await rpRes.json()
    if (!rpRes.ok) return res.status(400).json({ error: data?.error?.description || 'Order create failed', raw: data })

    res.status(200).json({ order: data, keyId: process.env.RAZORPAY_KEY_ID })
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Server error' })
  }
}
