// src/utils/loadRazorpay.js
let razorpayScriptPromise = null;

export function loadRazorpay() {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      if (typeof document === "undefined") {
        reject(new Error("Document not available"));
        return;
      }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error("Razorpay failed")));
      s.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(s);
    });
  }
  return razorpayScriptPromise;
}

export async function launchRazorpay(opts) {
  const {
    key,
    orderId,
    amount,
    name = "Picsellart",
    description = "",
    image = "/logo.png",
    prefill = {},
    notes = {},
    themeColor = "#6C63FF",
    handler,
  } = opts || {};
  const Razorpay = await loadRazorpay();
  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key,
      order_id: orderId,
      amount,
      currency: "INR",
      name,
      description,
      image,
      notes,
      prefill,
      theme: { color: themeColor },
      handler: (resp) => {
        try { if (typeof handler === "function") handler(resp); } catch {}
        resolve(resp);
      },
      modal: { ondismiss: () => reject(new Error("Payment closed by user")) },
    });
    rzp.open();
  });
}

export async function createOrderClient(payload) {
  const res = await fetch("/api/createOrder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  if (!res.ok) {
    const err = await (async () => { try { return await res.json(); } catch { return {}; } })();
    throw new Error(err?.error || "Failed to create order");
  }
  return res.json();
}
