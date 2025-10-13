// src/utils/razorpay.js
let scriptLoaded = false

export async function loadRazorpay() {
  if (scriptLoaded) return true
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.async = true
    s.onload = () => { scriptLoaded = true; resolve(true) }
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export async function openCheckout({ key, amount, name, description, orderId, prefill, notes, handler }) {
  const ok = await loadRazorpay()
  if (!ok) throw new Error('Razorpay SDK failed to load')

  const opts = {
    key,
    amount: Math.round(amount * 100),
    currency: 'INR',
    name,
    description,
    order_id: orderId,
    prefill,
    notes,
    theme: { color: '#111827' },
    handler,
  }
  const rzp = new window.Razorpay(opts)
  rzp.open()
  return rzp
}
