// Load Razorpay script and open checkout using the *public* key.
export async function loadRazorpayScript() {
  return new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existing) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function openCheckout({ order, customer, notes }) {
  const ok = await loadRazorpayScript()
  if (!ok) throw new Error('Failed to load Razorpay script')

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Picsellart',
    description: notes?.description ?? 'Picsellart subscription',
    order_id: order.id,
    prefill: {
      name: customer?.name ?? '',
      email: customer?.email ?? '',
    },
    notes: notes ?? {},
  }

  return new window.Razorpay(options)
}
