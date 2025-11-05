// Unified, named exports (fixes build errors)
export async function loadRazorpay() {
  if (window.Razorpay) return true;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = reject;
    document.body.appendChild(s);
  });
  return true;
}

// Turn our app user into Razorpay customer data
export function toCustomer(user) {
  return {
    name: user?.displayName || "Guest User",
    email: user?.email || "",
    contact: user?.phoneNumber || "",
  };
}

// Open Razorpay with an already-created order (you already have /api/create-order)
export async function openRazorpay({ key, amount, currency, orderId, user, onSuccess, onFailure }) {
  await loadRazorpay();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key,
      amount,           // in paise
      currency,
      order_id: orderId,
      prefill: toCustomer(user),
      handler: function (response) {
        try {
          onSuccess?.(response);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      },
      modal: { ondismiss: () => onFailure?.("dismissed") },
      theme: { color: "#111111" },
    });
    rzp.open();
  });
}
