// src/utils/plans.js
// Single source of truth for current plan rules.
// NOTE: Do not show "days" anywhere in the UI (per your requirement).

export const PLANS = {
  starter: {
    id: "starter",
    label: "Starter",
    priceINR: 100,
    uploadLimit: 25,
    maxPricePerImageINR: 199,
  },
  pro: {
    id: "pro",
    label: "Pro",
    priceINR: 300,
    uploadLimit: 30,
    maxPricePerImageINR: 249,
  },
  elite: {
    id: "elite",
    label: "Elite",
    priceINR: 800,
    uploadLimit: 50,
    maxPricePerImageINR: 249,
  },
};

// Helpful array for rendering
export const PLAN_LIST = [PLANS.starter, PLANS.pro, PLANS.elite];
