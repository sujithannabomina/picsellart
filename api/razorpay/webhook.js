// /api/razorpay/webhook.js
import crypto from 'crypto';

export const config = {
  api: { bodyParser: false } // read raw body for signature verification
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Missing RAZORPAY_WEBHOOK_SECRET' });
      return;
    }

    const raw = await readRaw(req);
    const signature = req.headers['x-razorpay-signature'];
    const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');

    if (signature !== expected) {
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    const event = JSON.parse(raw);
    // TODO: update Firestore: mark order/payment captured, grant download, etc.
    console.log('Razorpay webhook verified:', event?.event);

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('webhook error', e);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

function readRaw(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
