// src/utils/loadRazorpay.js

/**
 * Loads the Razorpay checkout script once and reuses it.
 * Returns true if loaded successfully, false otherwise.
 */
export async function loadRazorpay() {
  if (typeof window === "undefined") {
    // Build / SSR environment – just skip loading here
    return false;
  }

  // If script already exists, resolve immediately
  if (document.getElementById("razorpay-sdk")) {
    return true;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      reject(false);
    };
    document.body.appendChild(script);
  });
}

export default loadRazorpay;
