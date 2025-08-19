import crypto from 'crypto'


export default async function handler(req, res) {
try {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
const { orderId, razorpay_payment_id, razorpay_signature } = req.body || {}
if (!orderId || !razorpay_paymen