// src/utils/loadRazorpay.js
let promise;

/**
 * Loads Razorpay checkout script once and resolves with window.Razorpay.
 * Provides BOTH a named and default export for compatibility.
 */
export function loadRazorpay() {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () =>
        typeof window !== "undefined" && window.Razorpay
          ? resolve(window.Razorpay)
          : reject(new Error("Razorpay SDK failed to load"));
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.head.appendChild(script);
    });
  }
  return promise;
}

export default loadRazorpay;
