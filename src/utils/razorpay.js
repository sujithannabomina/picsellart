export async function openCheckout({ key, amount, currency, name, description, orderId, prefill, notes, handler }) {
return new Promise((resolve, reject) => {
if (!window.Razorpay) return reject(new Error('Razorpay SDK not loaded'))
const options = {
key,
amount,
currency: currency || 'INR',
name: name || 'Picsellart',
description: description || 'Purchase',
order_id: orderId,
prefill,
notes,
theme: { color: '#111827' },
handler: function (response) {
handler?.(response)
resolve(response)
},
modal: {
ondismiss: () => reject(new Error('Payment cancelled')),
},
}
const rzp = new window.Razorpay(options)
rzp.open()
})
}