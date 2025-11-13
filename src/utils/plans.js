// Seller subscription plans + helper utilities

export const SELLER_PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceInRupees: 100,
    maxUploads: 25,
    maxPricePerImage: 199,
    durationDays: 180,
  },
  {
    id: "pro",
    name: "Pro",
    priceInRupees: 300,
    maxUploads: 30,
    maxPricePerImage: 249,
    durationDays: 180,
  },
  {
    id: "elite",
    name: "Elite",
    priceInRupees: 800,
    maxUploads: 50,
    maxPricePerImage: 249,
    durationDays: 180,
  },
];

// Default limits used if something goes wrong while loading seller profile
export const DEFAULT_SELLER_LIMITS = {
  planId: "starter",
  maxUploads: 25,
  maxPricePerImage: 199,
  uploadsUsed: 0,
  expiresAt: null,
};

export function getPlanById(id) {
  return SELLER_PLANS.find((p) => p.id === id) || null;
}

export function getDisplayPrice(planId) {
  const plan = getPlanById(planId);
  if (!plan) return "";
  return `₹${plan.priceInRupees.toLocaleString("en-IN")}`;
}
