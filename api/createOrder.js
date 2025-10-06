export const config = { runtime: 'nodejs18.x' }

function b64(str) {
  return Buffer.from(str, 'utf8').toString('base64')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { amount, receipt } = req.body || {}
    if (!amount || typeof amount !== 'number') {
      res.status(400).json({ error: 'Amount (paise) required as number' })
      return
    }

    const key = process.env.RAZORPAY_KEY_ID
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!key || !secret) {
      res.status(500).json({ error: 'Razorpay keys not configured on server' })
      return
    }

    const resp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${b64(`${key}:${secret}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,               // in paise
        currency: 'INR',
        receipt: receipt || `order_${Date.now()}`,
        payment_capture: 1
      })
    })

    if (!resp.ok) {
      const txt = await resp.text()
      res.status(500).json({ error: 'Razorpay order creation failed', details: txt })
      return
    }

    const data = await resp.json()
    res.status(200).json({ orderId: data.id })
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Server error' })
  }
}
