import { loadRazorpay } from "./loadRazorpay";

export async function openCheckout(opts) {
  const Razorpay = await loadRazorpay();
  const rzp = new Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    ...opts,
    handler: function (response) {
      // You can POST to /api/verifyPayment here if desired
      alert("Payment successful!");
    },
    modal: { ondismiss(){ /* optionally handle */ } }
  });
  rzp.open();
}
