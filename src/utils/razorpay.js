// src/utils/razorpay.js
export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.id = 'razorpay-sdk';
    s.onload = () => resolve(true);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

export async function createServerOrder(body, endpoint = '/api/razorpay/create-order') {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error('Failed to create order');
  }
  return res.json(); // { orderId, amount, currency, key }
}

export function openCheckout({ key, amount, currency, name, description, order_id, prefill, notes, handler }) {
  const options = {
    key,
    amount,
    currency,
    name,
    description,
    order_id,
    prefill,
    notes,
    handler, // (response) => {}
    theme: { color: '#2563eb' },
  };
  // eslint-disable-next-line no-undef
  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
}
