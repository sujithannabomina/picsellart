// src/utils/razorpay.js
import { loadRazorpay } from "./loadRazorpay";

/**
 * Generic Razorpay checkout helper.
 *
 * config = {
 *   amount,         // in paise
 *   name,
 *   description,
 *   image,          // logo path
 *   prefill: { name, email, contact },
 *   onSuccess(paymentResponse),
 *   onFailure?(error)
 * }
 */
export async function openCheckout(config) {
  const loaded = await loadRazorpay();
  if (!loaded) {
    alert("Unable to load payment gateway. Please try again.");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount: config.amount,
    currency: "INR",
    name: config.name || "PicSellArt",
    description: config.description || "",
    image: config.image || "/logo.png",
    prefill: config.prefill || {},
    handler: function (response) {
      if (typeof config.onSuccess === "function") {
        config.onSuccess(response);
      }
    },
    modal: {
      ondismiss: function () {
        if (typeof config.onFailure === "function") {
          config.onFailure(new Error("Payment dismissed"));
        }
      },
    },
    theme: {
      color: "#4f46e5",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
