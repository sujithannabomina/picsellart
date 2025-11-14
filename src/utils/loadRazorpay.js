// src/utils/loadRazorpay.js

let razorpayScriptPromise = null;

/**
 * Loads Razorpay checkout.js only once and returns a Promise
 * that resolves when window.Razorpay is available.
 */
export function loadRazorpayScript() {
  if (typeof window === "undefined") {
    // Safety for SSR / build-time – don't try to touch window
    return Promise.reject(new Error("Razorpay can only be loaded in the browser"));
  }

  // If it's already loaded, just resolve immediately
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  // If a load is already in progress, return the same promise
  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  // Create and store the promise so multiple callers share it
  razorpayScriptPromise = new Promise((resolve, reject) => {
    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error("Razorpay script loaded but window.Razorpay is missing"));
        }
      };

      script.onerror = () => {
        razorpayScriptPromise = null;
        reject(new Error("Failed to load Razorpay script"));
      };

      document.body.appendChild(script);
    } catch (err) {
      razorpayScriptPromise = null;
      reject(err);
    }
  });

  return razorpayScriptPromise;
}

// Optional default export (harmless, and avoids future import mistakes)
export default loadRazorpayScript;
