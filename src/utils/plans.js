// src/utils/plans.js
export const PLANS = {
  starter: {
    id: "starter",
    label: "Starter",
    priceINR: 100,
    uploadLimit: 25,
    maxPricePerImage: 199,
  },
  pro: {
    id: "pro",
    label: "Pro",
    priceINR: 300,
    uploadLimit: 30,
    maxPricePerImage: 249,
  },
  elite: {
    id: "elite",
    label: "Elite",
    priceINR: 800,
    uploadLimit: 50,
    maxPricePerImage: 249,
  },
};

// convenient ordered list
export const PLAN_LIST = [PLANS.starter, PLANS.pro, PLANS.elite];
