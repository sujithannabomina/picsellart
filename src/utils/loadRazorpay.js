// src/utils/loadRazorpay.js

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

/**
 * Production-ready front-end Checkout invocation.
 * NOTE: For live capture + receipts, you should create orders on your server.
 * This client-side flow still opens Checkout and completes payment with key.
 * Put your key in Vercel env as VITE_RAZORPAY_KEY
 */
export async function openRazorpay({ amount, name, description, onSuccess, onCancel }) {
  const key = import.meta.env.VITE_RAZORPAY_KEY;
  if (!key) {
    alert("Payment key missing. Please set VITE_RAZORPAY_KEY in environment.");
    return;
  }
  if (!window.Razorpay) {
    await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }

  const options = {
    key,
    amount: amount * 100, // paise
    currency: "INR",
    name: "Picsellart",
    description,
    image: "/favicon.ico",
    handler: function (response) {
      try {
        onSuccess?.(response);
      } catch {}
    },
    modal: {
      ondismiss: function () {
        try {
          onCancel?.();
        } catch {}
      },
    },
    notes: { product: name },
    theme: { color: "#4f46e5" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
