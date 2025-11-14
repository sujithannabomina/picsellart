// src/utils/razorpay.js
import { loadRazorpay } from "./loadRazorpay";

/**
 * Open the Razorpay checkout widget.
 *
 * amount: in RUPEES (we convert to paise here)
 */
export async function openCheckout({
  amount,
  currency = "INR",
  imageTitle,
  imageName,
  buyer,
  onSuccess,
  onFailure
}) {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!razorpayKey) {
    alert("Payments are not configured yet. Please contact support.");
    return;
  }

  const loaded = await loadRazorpay();
  if (!loaded) {
    alert("Unable to load the payment gateway. Please try again.");
    return;
  }

  const finalAmountPaise = Math.round(Number(amount || 0) * 100);

  const options = {
    key: razorpayKey,
    amount: finalAmountPaise, // paise
    currency,
    name: "Picsellart",
    description: `Purchase: ${imageTitle || imageName}`,
    image: "/logo.png",
    handler: function (response) {
      // Successful payment
      onSuccess?.(response);
    },
    prefill: {
      name: buyer?.displayName || "",
      email: buyer?.email || ""
    },
    notes: {
      imageName: imageName || "",
      platform: "picsellart"
    },
    theme: {
      color: "#5b3df5"
    }
  };

  const rzp = new window.Razorpay(options);

  rzp.on("payment.failed", function (response) {
    console.error("Razorpay payment failed", response.error);
    onFailure?.(response);
  });

  rzp.open();
}
