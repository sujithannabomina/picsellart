// src/utils/loadRazorpay.js
// Production-ready helpers for Razorpay Checkout integration.
// Exports: loadRazorpay (alias used by SellerSubscribe.jsx), openRazorpay, toCustomer.

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/** Load Razorpay SDK exactly once on the client. */
function loadSdk() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return reject(new Error("Razorpay can only be initialized in the browser."));
    }
    if (window.Razorpay) return resolve();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () =>
      window.Razorpay ? resolve() : reject(new Error("Razorpay SDK failed to load"));
    script.onerror = () => reject(new Error("Unable to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

/** Map your logged-in user to Razorpay prefill fields. */
export function toCustomer(user) {
  const name =
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Picsellart User";
  const email = user?.email || "";
  const contact = (user?.phoneNumber || user?.phone || user?.profile?.phone || "")
    .toString()
    .replace(/[^\d+]/g, "");
  return { name, email, contact };
}

/**
 * Open Razorpay Checkout for a seller plan purchase.
 * @param {{ plan:{id:string,label?:string,price:number,maxUploads:number,maxPricePerImage:number,days:number}, user:any, onSuccess?:Function, onFailure?:Function }} params
 * @returns {Promise<{status:'success', planId:string, paymentId:string, orderId:string}>}
 */
export async function openRazorpay({ plan, user, onSuccess, onFailure }) {
  if (!RAZORPAY_KEY_ID) throw new Error("Missing VITE_RAZORPAY_KEY_ID env var.");
  if (!plan?.id || typeof plan.price !== "number")
    throw new Error("Invalid plan details supplied to openRazorpay.");

  await loadSdk();

  // 1) Create order on server (amount in paise)
  const orderRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Math.round(plan.price * 100),
      currency: "INR",
      notes: {
        type: "seller_plan",
        plan_id: plan.id,
        plan_label: plan.label || plan.id,
        max_uploads: String(plan.maxUploads),
        max_price_per_image: String(plan.maxPricePerImage),
        days: String(plan.days),
        user_id: user?.uid || user?.id || "",
      },
    }),
  });
  if (!orderRes.ok) {
    throw new Error(`Failed to create Razorpay order: ${await orderRes.text()}`);
  }
  const { orderId, amount, currency } = await orderRes.json();

  const prefill = toCustomer(user);

  // Wrap Razorpay callbacks in a promise
  let resolvePromise, rejectPromise;
  const done = new Promise((res, rej) => {
    resolvePromise = res;
    rejectPromise = rej;
  });

  const options = {
    key: RAZORPAY_KEY_ID,
    amount,
    currency: currency || "INR",
    name: "Picsellart",
    description: `Subscription: ${plan.label || plan.id}`,
    order_id: orderId,
    prefill,
    theme: { color: "#111827" },
    notes: {
      plan_id: plan.id,
      plan_label: plan.label || plan.id,
      user_id: user?.uid || user?.id || "",
    },
    handler: async (response) => {
      try {
        // 2) Verify payment & fulfill on server
        const verifyRes = await fetch("/api/verifyPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            context: {
              type: "seller_plan",
              plan,
              userId: user?.uid || user?.id || "",
            },
          }),
        });
        if (!verifyRes.ok) throw new Error(await verifyRes.text());

        onSuccess?.(response);
        resolvePromise({
          status: "success",
          planId: plan.id,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
      } catch (err) {
        onFailure?.(err);
        rejectPromise(err);
      }
    },
    modal: {
      ondismiss: () => {
        const err = new Error("Payment window closed by user.");
        onFailure?.(err);
        rejectPromise(err);
      },
      confirm_close: true,
      animation: true,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", (rsp) => {
    const err = new Error(rsp?.error?.description || "Payment failed.");
    onFailure?.(err);
    rejectPromise(err);
  });
  rzp.open();

  return done;
}

/** Alias retained for older imports (e.g., SellerSubscribe.jsx) */
export async function loadRazorpay(params) {
  return openRazorpay(params);
}

export default openRazorpay;
