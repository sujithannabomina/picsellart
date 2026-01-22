// src/utils/plans.js
// Option A: Show as "Account Activation" (not "Subscription plan").
// No "days" mentioned anywhere.

export const SELLER_PLANS = [
  {
    id: "starter",
    title: "Starter",
    priceINR: 100,
    maxUploads: 25,
    maxPriceINR: 199,
    badge: "Best for new sellers",
    description:
      "Activate your seller account and start listing your photos with simple limits.",
  },
  {
    id: "pro",
    title: "Pro",
    priceINR: 300,
    maxUploads: 30,
    maxPriceINR: 249,
    badge: "Most popular",
    description:
      "For consistent sellers who want higher upload capacity and stronger pricing.",
  },
  {
    id: "elite",
    title: "Elite",
    priceINR: 800,
    maxUploads: 50,
    maxPriceINR: 249,
    badge: "For power sellers",
    description:
      "Maximum uploads with premium account activation benefits.",
  },
];

export const COMMISSION_RATE = 0.10; // 10% per sale

export function getPlan(planId) {
  return SELLER_PLANS.find((p) => p.id === planId) || null;
}
