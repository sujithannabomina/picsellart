// Serverless endpoint to verify Razorpay payment signature

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body || {};

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      res.status(400).json({ ok: false, error: 'Missing payment fields' });
      return;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      res.status(500).json({ ok: false, error: 'Server not configured' });
      return;
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const ok = expected === razorpay_signature;

    res.status(200).json({ ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'Server error' });
  }
};
