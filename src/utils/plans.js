// FILE PATH: src/utils/plans.js
// Keep plan definitions + shared helpers in one place.

// ✅ Seller commission (example: 20% platform fee)
export const COMMISSION_RATE = 0.2;

// ✅ Canonical plans list (no "days", only "6 months")
export const PLANS = [
  {
    id: "starter",
    title: "Starter",
    name: "Starter",
    badge: "Best for getting started",
    priceINR: 100,
    maxUploads: 25,

    // ✅ Canonical field
    maxPricePerImageINR: 199,

    // ✅ Backward-compatible field used by existing pages
    maxPriceINR: 199,

    durationLabel: "6 months",
    description: "Ideal for new sellers who want to start listing and selling quickly.",
  },
  {
    id: "pro",
    title: "Pro",
    name: "Pro",
    badge: "Most popular",
    priceINR: 300,
    maxUploads: 30,

    maxPricePerImageINR: 249,
    maxPriceINR: 249,

    durationLabel: "6 months",
    description: "Perfect for regular sellers who upload frequently and need more capacity.",
  },
  {
    id: "elite",
    title: "Elite",
    name: "Elite",
    badge: "For heavy sellers",
    priceINR: 800,
    maxUploads: 50,

    maxPricePerImageINR: 249,
    maxPriceINR: 249,

    durationLabel: "6 months",
    description: "Best for power sellers who want maximum uploads and serious selling.",
  },
];

// ✅ Compatibility exports (your pages expect these)
export const SELLER_PLANS = PLANS;

export function getPlan(id) {
  return PLANS.find((p) => p.id === id) || null;
}

export function getPlanById(id) {
  return getPlan(id);
}

// ✅ Used by Explore.jsx (keep as-is)
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
