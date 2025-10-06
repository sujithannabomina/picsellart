// Serverless endpoint to create a Razorpay order
// Uses Node runtime (default). No extra npm packages needed.

function b64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { amount, receipt } = req.body || {};
    if (!amount || typeof amount !== 'number') {
      res.status(400).json({ error: 'Amount (paise) required as number' });
      return;
    }

    const key = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key || !secret) {
      res.status(500).json({ error: 'Razorpay keys not configured on server' });
      return;
    }

    // Node 20 has global fetch
    const rp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${b64(`${key}:${secret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,                // paise
        currency: 'INR',
        receipt: receipt || `order_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    if (!rp.ok) {
      const txt = await rp.text();
      res.status(500).json({ error: 'Razorpay order creation failed', details: txt });
      return;
    }

    const data = await rp.json();
    res.status(200).json({ orderId: data.id });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
};
