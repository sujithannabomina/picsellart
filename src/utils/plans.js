// src/utils/plans.js
// Central definition of seller subscription packs.
// Used by SellerRenew.jsx (and anywhere else that needs plan data).

// Prices are INR; duration is enforced in code (not shown to users).
export const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    priceINR: 100,           // pack price
    uploadLimit: 25,         // max number of images a seller can upload
    maxPricePerImageINR: 199,
    durationDays: 180,       // do NOT display this anywhere
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceINR: 300,
    uploadLimit: 30,
    maxPricePerImageINR: 249,
    durationDays: 180,
  },
  elite: {
    id: "elite",
    name: "Elite",
    priceINR: 800,
    uploadLimit: 50,
    maxPricePerImageINR: 249,
    durationDays: 180,
  },
};

// Handy list when you want to iterate in the UI (e.g., SellerRenew.jsx)
export const PLAN_LIST = Object.values(PLANS);

// Utility getters
export function getPlanById(id) {
  return PLANS[id] || null;
}

/**
 * Returns the max allowed price per image for a seller's current plan.
 * Pass in the plan id you've stored on the seller (e.g. "starter" | "pro" | "elite").
 */
export function getMaxPriceForPlan(planId) {
  const p = getPlanById(planId);
  return p ? p.maxPricePerImageINR : null;
}

/**
 * Returns the upload cap for a seller's current plan.
 */
export function getUploadLimitForPlan(planId) {
  const p = getPlanById(planId);
  return p ? p.uploadLimit : null;
}
