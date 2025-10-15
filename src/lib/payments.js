// Razorpay client helper (front-end)
export const PRICE_PLANS = [
  { id: "starter", name: "Starter", priceINR: 199, maxPricePerPhoto: 199, uploadLimit: 25 },
  { id: "pro",     name: "Pro",     priceINR: 499, maxPricePerPhoto: 499, uploadLimit: 200 },
  { id: "elite",   name: "Elite",   priceINR: 999, maxPricePerPhoto: 999, uploadLimit: 1000 },
];

// Open Razorpay checkout. The order is created by cloud function.
export async function openRazorpay(order) {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: window.__RAZORPAY_KEY__,       // set in index.html or injected on window
      amount: order.amount,
      currency: "INR",
      name: "Picsellart Seller Plan",
      description: `Plan: ${order.planName}`,
      order_id: order.orderId,
      handler: function (response) { resolve(response); },
      modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      prefill: {},
      notes: { planId: order.planId },
      theme: {},
    });
    rzp.open();
  });
}
