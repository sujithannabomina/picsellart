// src/utils/razorpay.js
import { loadRazorpayScript } from "./loadRazorpay";

// Generic helper
const openRazorpay = async ({ amount, user, description, notes, onSuccess }) => {
  await loadRazorpayScript();

  if (!window.Razorpay) {
    alert("Unable to load Razorpay. Please try again.");
    return;
  }

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) {
    console.warn("Missing VITE_RAZORPAY_KEY_ID");
  }

  const options = {
    key,
    amount: amount * 100, // rupees -> paise
    currency: "INR",
    name: "Picsellart",
    description,
    notes,
    prefill: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
    handler: async (response) => {
      try {
        await onSuccess(response);
      } catch (err) {
        console.error("Error after Razorpay success:", err);
        alert("Payment captured but there was an internal error.");
      }
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

// Purchase a single photo
export const openPhotoCheckout = async ({ user, photo, onSuccess }) => {
  await openRazorpay({
    amount: photo.price,
    user,
    description: `Purchase: ${photo.fileName}`,
    notes: {
      type: "photo",
      fileName: photo.fileName,
    },
    onSuccess,
  });
};

// Activate a seller plan
export const openPlanCheckout = async ({ user, plan, onSuccess }) => {
  await openRazorpay({
    amount: plan.price,
    user,
    description: `Seller Plan: ${plan.name}`,
    notes: {
      type: "plan",
      planId: plan.id,
    },
    onSuccess,
  });
};
