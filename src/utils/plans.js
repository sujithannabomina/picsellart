// src/utils/plans.js
// Keep plan definitions + shared helpers in one place.

// ✅ Canonical plans list
export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceINR: 100,
    maxUploads: 25,
    maxPricePerImageINR: 199,
    durationLabel: "6 months", // no "days"
  },
  {
    id: "pro",
    name: "Pro",
    priceINR: 300,
    maxUploads: 30,
    maxPricePerImageINR: 249,
    durationLabel: "6 months",
  },
  {
    id: "elite",
    name: "Elite",
    priceINR: 800,
    maxUploads: 50,
    maxPricePerImageINR: 249,
    durationLabel: "6 months",
  },
];

// ✅ Compatibility exports (your SellerOnboarding.jsx expects these)
export const SELLER_PLANS = PLANS;

// Old name expected by SellerOnboarding.jsx
export function getPlan(id) {
  return PLANS.find((p) => p.id === id) || null;
}

// New name (safe to keep)
export function getPlanById(id) {
  return getPlan(id);
}

// ✅ Used by Explore.jsx (your previous error)
export function formatINR(amount) {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  }
}
