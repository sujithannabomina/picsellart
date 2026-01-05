// src/utils/plans.js

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceINR: 100,
    maxUploads: 25,
    maxPricePerImageINR: 199,
    durationDays: 180,
    bestFor: "New sellers testing the platform",
  },
  {
    id: "pro",
    name: "Pro",
    priceINR: 300,
    maxUploads: 30,
    maxPricePerImageINR: 249,
    durationDays: 180,
    bestFor: "Active sellers uploading regularly",
  },
  {
    id: "elite",
    name: "Elite",
    priceINR: 800,
    maxUploads: 50,
    maxPricePerImageINR: 249,
    durationDays: 180,
    bestFor: "Power sellers with a bigger catalog",
  },
];

export function getPlan(planId) {
  return PLANS.find((p) => p.id === planId) || null;
}

export function computePlanExpiryISO(durationDays = 180) {
  const d = new Date();
  d.setDate(d.getDate() + Number(durationDays || 180));
  return d.toISOString();
}
