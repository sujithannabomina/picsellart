// src/utils/plans.js

// Central place for plan definitions + shared helpers.
// NOTE: Keep labels human-friendly (no "days" in UI).

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceINR: 100,
    maxUploads: 25,
    maxPricePerImageINR: 199,
    durationLabel: "6 months",
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

export function getPlanById(id) {
  return PLANS.find((p) => p.id === id) || null;
}

// ✅ This is what Explore.jsx expects to exist
export function formatINR(amount) {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    // Fallback (rare environments)
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  }
}
