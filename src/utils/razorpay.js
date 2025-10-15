// Tiny client wrapper for Razorpay checkout
export async function openRazorpay(order) {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: window.__RAZORPAY_KEY__ || "",
      amount: order.amount,
      currency: "INR",
      name: "Picsellart Seller Plan",
      description: `Plan: ${order.planName}`,
      order_id: order.orderId,
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      notes: { planId: order.planId },
    });
    rzp.open();
  });
}
