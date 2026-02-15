// FILE PATH: src/utils/plans.js
// Keep plan definitions + shared helpers in one place.

// ✅ Seller commission (example: 20% platform fee)
export const COMMISSION_RATE = 0.2;

// ✅ Canonical plans list
export const PLANS = [
  {
    id: "starter",
    title: "Starter",
    badge: "Best for getting started",
    description: "Ideal for new sellers who want to start listing and selling quickly.",
    priceINR: 100,
    maxUploads: 25,
    // ✅ FIX: match SellerOnboarding.jsx usage
    maxPriceINR: 199,
    durationLabel: "6 months",
  },
  {
    id: "pro",
    title: "Pro",
    badge: "Most popular",
    description: "Perfect for regular sellers who upload frequently and need more capacity.",
    priceINR: 300,
    maxUploads: 30,
    // ✅ FIX: match SellerOnboarding.jsx usage
    maxPriceINR: 249,
    durationLabel: "6 months",
  },
  {
    id: "elite",
    title: "Elite",
    badge: "For heavy sellers",
    description: "Best for power sellers who want maximum uploads and serious selling.",
    priceINR: 800,
    maxUploads: 50,
    // ✅ FIX: match SellerOnboarding.jsx usage
    maxPriceINR: 249,
    durationLabel: "6 months",
  },
];

// ✅ Compatibility exports (your files expect these)
export const SELLER_PLANS = PLANS;

// Old name expected by Seller pages
export function getPlan(id) {
  return PLANS.find((p) => p.id === id) || null;
}

// New name (safe to keep)
export function getPlanById(id) {
  return getPlan(id);
}

// ✅ Used by Explore.jsx
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
