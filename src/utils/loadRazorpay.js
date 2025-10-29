// src/utils/loadRazorpay.js
// Production-ready helpers to open Razorpay Checkout for seller plan purchases.
// Exports: openRazorpay (main flow) and toCustomer (maps your user -> Razorpay prefill)

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

/** Load Razorpay JS once, safely. */
function loadSdk() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => (window.Razorpay ? resolve() : reject(new Error("Razorpay SDK failed to load")));
    script.onerror = () => reject(new Error("Unable to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

/** Map your logged-in user to Razorpay's prefill/customer fields. */
export function toCustomer(user) {
  // Accepts Firebase user or an object with similar fields.
  const name =
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Picsellart User";
  const email = user?.email || "";
  const contact =
    // try phoneNumber like +91...
    (user?.phoneNumber || user?.phone || user?.profile?.phone || "").replace(/[^\d+]/g, "");

  return { name, email, contact };
}

/**
 * Open Razorpay Checkout for a seller plan.
 * @param {{ plan: { id:string, label?:string, price:number, maxUploads:number, maxPricePerImage:number, days:number }, user: any, onSuccess?: Function, onFailure?: Function }} params
 * @returns {Promise<{status:'success', planId:string, paymentId:string, orderId:string}>}
 */
export async function openRazorpay({ plan, user, onSuccess, onFailure }) {
  if (!RAZORPAY_KEY_ID) {
    throw new Error("Missing VITE_RAZORPAY_KEY_ID in environment.");
  }
  if (!plan?.id || typeof plan.price !== "number") {
    throw new Error("Invalid plan details supplied to openRazorpay.");
  }

  await loadSdk();

  // 1) Create an order on our server (amount in paise)
  const orderRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Math.round(plan.price * 100),
      currency: "INR",
      // Keep helpful metadata on the order
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
    const txt = await orderRes.text().catch(() => "");
    throw new Error(`Failed to create order. ${txt}`);
  }
  const { orderId, amount, currency } = await orderRes.json();

  // 2) Build Checkout options
  const prefill = toCustomer(user);
  const options = {
    key: RAZORPAY_KEY_ID,
    amount,
    currency: currency || "INR",
    name: "Picsellart",
    description: `Subscription: ${plan.label || plan.id}`,
    order_id: orderId,
    prefill,
    theme: { color: "#111827" }, // neutral brand color; change if needed
    notes: {
      plan_id: plan.id,
      plan_label: plan.label || plan.id,
      user_id: user?.uid || user?.id || "",
    },
    handler: async function (response) {
      try {
        // 3) Verify on our server
        const verifyRes = await fetch("/api/verifyPayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            // Extra context for server-side fulfillment:
            context: {
              type: "seller_plan",
              plan,
              userId: user?.uid || user?.id || "",
            },
          }),
        });

        if (!verifyRes.ok) {
          const msg = await verifyRes.text().catch(() => "Payment verification failed.");
          throw new Error(msg);
        }

        onSuccess?.(response);
        resolvePromise({
          status: "success",
          planId: plan.id,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
      } catch (e) {
        onFailure?.(e);
        rejectPromise(e);
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

  // 4) Open Checkout and return a promise that resolves from handler/ondismiss
  let resolvePromise, rejectPromise;
  const done = new Promise((res, rej) => {
    resolvePromise = res;
    rejectPromise = rej;
  });

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", (rsp) => {
    const err = new Error(rsp?.error?.description || "Payment failed.");
    onFailure?.(err);
    rejectPromise(err);
  });
  rzp.open();

  return done;
}
