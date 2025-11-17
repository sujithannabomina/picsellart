// src/utils/razorpay.js

import { loadRazorpay } from "./loadRazorpay";

/**
 * Generic Razorpay checkout opener for Picsellart.
 *
 * Usage from any page:
 *   openCheckout({
 *     amount: 49900,          // amount in paise
 *     currency: "INR",
 *     description: "Photo purchase",
 *     metadata: { photoId, planId, buyerId }
 *   });
 *
 * It will:
 * 1. Load Razorpay script
 * 2. Call /api/razorpay/create-order to create an order
 * 3. Open Razorpay checkout
 * 4. Call /api/razorpay/verifyPayment after success
 */
export async function openCheckout({
  amount,
  currency = "INR",
  description = "Picsellart purchase",
  metadata = {},
  buyerDetails = {},
}) {
  try {
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      alert("Unable to load payment gateway. Please check your connection and try again.");
      return;
    }

    if (typeof window === "undefined") {
      console.error("openCheckout called in a non-browser environment");
      return;
    }

    // 1️⃣ Create order on backend
    const createOrderResponse = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency,
        metadata,
      }),
    });

    if (!createOrderResponse.ok) {
      console.error("Failed to create Razorpay order");
      alert("Unable to start payment. Please try again.");
      return;
    }

    const orderData = await createOrderResponse.json();

    // 2️⃣ Prepare Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // set this in .env and in Vercel
      amount: orderData.amount,                 // in paise
      currency: orderData.currency || currency,
      name: "Picsellart",
      description,
      order_id: orderData.id || orderData.orderId,
      prefill: {
        name: buyerDetails.name || "",
        email: buyerDetails.email || "",
        contact: buyerDetails.phone || "",
      },
      notes: metadata,
      theme: {
        color: "#2563eb",
      },
      handler: async function (response) {
        // 3️⃣ Verify payment on backend
        try {
          const verifyRes = await fetch("/api/razorpay/verifyPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderId: orderData.id || orderData.orderId,
              metadata,
            }),
          });

          if (!verifyRes.ok) {
            console.error("Payment verification failed");
            alert("Payment captured, but verification failed. Please contact support.");
            return;
          }

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Thank you.");
          } else {
            alert("Payment could not be verified. Please contact support.");
          }
        } catch (err) {
          console.error("Error while verifying payment", err);
          alert("Payment verification error. Please contact support.");
        }
      },
      modal: {
        ondismiss: function () {
          console.log("Razorpay checkout closed by user");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error in openCheckout:", error);
    alert("Something went wrong while starting the payment. Please try again.");
  }
}

// Also provide a default export in case any old code imports default.
export default openCheckout;
