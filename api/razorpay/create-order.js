// /api/razorpay/create-order.js
import crypto from 'crypto';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      res.status(500).json({ error: 'Missing Razorpay credentials' });
      return;
    }

    const body = await readBody(req);
    const amount = Number(body?.amount ?? 0);
    const currency = (body?.currency || 'INR').toUpperCase();

    if (!amount || amount < 100) {
      res.status(400).json({ error: 'Invalid amount (min ₹1.00 = 100 paise)' });
      return;
    }

    // Create order via Razorpay REST
    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt: body?.receipt || 'rcpt_' + Date.now(),
      notes: body?.notes || {}
    });

    res.status(200).json(order);
  } catch (e) {
    console.error('create-order error', e);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

async function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); }
      catch { resolve({}); }
    });
  });
}

async function createRazorpayOrder({ amount, currency, receipt, notes }) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount, currency, receipt, notes })
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Razorpay order failed: ${res.status} ${t}`);
  }
  return res.json();
}
