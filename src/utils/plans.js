// src/utils/plans.js
// Central definition of seller subscription plans + helpers used across the app.
// Matches your permanent business rules:
// - starter: ₹100, 25 uploads, max ₹199/image, 180 days
// - pro:     ₹300, 30 uploads, max ₹249/image, 180 days
// - elite:   ₹800, 50 uploads, max ₹249/image, 180 days

export const ACCOUNT_RULES = {
  currency: "INR",
  minImagePrice: 1, // hard floor for any listing
};

export const plans = [
  {
    id: "starter",
    label: "Starter",
    price: 100,
    maxUploads: 25,
    maxPricePerImage: 199,
    days: 180,
  },
  {
    id: "pro",
    label: "Pro",
    price: 300,
    maxUploads: 30,
    maxPricePerImage: 249,
    days: 180,
  },
  {
    id: "elite",
    label: "Elite",
    price: 800,
    maxUploads: 50,
    maxPricePerImage: 249,
    days: 180,
  },
];

// convenient lookup map by id
export const PLANS = Object.freeze(
  Object.fromEntries(plans.map((p) => [p.id, Object.freeze(p)]))
);

// ms helper for subscriptions
export const daysToMs = (d) => d * 24 * 60 * 60 * 1000;

// get a plan or null
export function getPlanById(id) {
  return PLANS[id] || null;
}

// limits that other modules (upload, pricing, dashboards) can consume
export function getLimits(planId) {
  const p = getPlanById(planId);
  if (!p) return null;
  return {
    maxUploads: p.maxUploads,
    maxPricePerImage: p.maxPricePerImage,
    expiresInDays: p.days,
    expiresInMs: daysToMs(p.days),
  };
}

// validate that an image price is allowed for a given plan
export function validateImagePrice(amount, planId) {
  const p = getPlanById(planId);
  if (!p) {
    return { ok: false, reason: "invalid-plan" };
  }
  const min = ACCOUNT_RULES.minImagePrice;
  const max = p.maxPricePerImage;
  const ok = typeof amount === "number" && amount >= min && amount <= max;
  return { ok, min, max, plan: p.id };
}

// check if seller can upload more given current count
export function canUploadMore(currentCount, planId) {
  const p = getPlanById(planId);
  if (!p) return false;
  return Number(currentCount) < p.maxUploads;
}
