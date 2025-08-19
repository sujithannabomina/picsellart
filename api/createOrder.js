import Razorpay from 'razorpay'


export default async function handler(req, res) {
try {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
const { amount, receipt } = req.body || {}
if (!amount) return res.status(400).json({ error: 'Amount required' })


const instance = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET,
})


const order = await instance.orders.create({ amount, currency: 'INR', receipt })
return res.status(200).json({ orderId: order.id })
} catch (e) {
console.error(e)
return res.status(500).json({ error: 'Failed to create order' })
}
}