function loadScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

/**
 * openRazorpay({ amount, description, notes, onSuccess })
 */
export async function openRazorpay({ amount, description, notes, onSuccess }) {
  await loadScript();

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount, // in paise
    currency: "INR",
    name: "Picsellart",
    description,
    notes,
    // Keep login inside your app — no phone prefill
    handler: function (response) {
      onSuccess?.(response);
    },
    modal: {
      ondismiss: function () {},
    },
    theme: { color: "#7c5cff" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
