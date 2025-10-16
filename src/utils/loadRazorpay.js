// src/utils/loadRazorpay.js
let scriptLoaded = false;
let loadingPromise = null;

export async function ensureRazorpay() {
  if (scriptLoaded) return;
  if (!loadingPromise) {
    loadingPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => {
        scriptLoaded = true;
        resolve();
      };
      s.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(s);
    });
  }
  return loadingPromise;
}

/**
 * Opens Razorpay Checkout
 * @param {{order: any, metadata?: object, onSuccess?: Function, onFailure?: Function}} params
 */
export async function openRazorpay({ order, metadata = {}, onSuccess, onFailure }) {
  await ensureRazorpay();

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) {
    console.error("Missing VITE_RAZORPAY_KEY_ID in environment");
    alert("Payment config error. Contact support.");
    return;
  }

  const options = {
    key,
    amount: order.amount,      // in paise
    currency: order.currency || "INR",
    name: "Picsellart",
    description: metadata.title ? `License: ${metadata.title}` : "Image License",
    order_id: order.id,
    handler: async function (response) {
      try {
        const res = await fetch("/api/verifyPhotoPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            photoPath: metadata.photoPath,
            sellerId: metadata.sellerId || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Verification failed");
        onSuccess?.(data);
      } catch (e) {
        console.error(e);
        alert("Payment verified but fulfilment failed. Please contact support with your Order ID.");
        onFailure?.(e);
      }
    },
    notes: {
      photoPath: metadata.photoPath || "",
      sellerId: metadata.sellerId || "",
      isSample: metadata.isSample ? "1" : "0",
    },
    theme: { color: "#6d5efc" },
    modal: { ondismiss: () => onFailure?.(new Error("Payment cancelled"))) },
    prefill: {
      name: metadata.prefillName || "",
      email: metadata.prefillEmail || "",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
