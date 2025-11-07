// src/utils/plans.js
export const PLANS = {
  starter: { id: "starter", label: "Starter", price: 100, maxUploads: 25, maxPrice: 199, days: 180 },
  pro:     { id: "pro",     label: "Pro",     price: 300, maxUploads: 30, maxPrice: 249, days: 180 },
  elite:   { id: "elite",   label: "Elite",   price: 800, maxUploads: 50, maxPrice: 249, days: 180 },
};

// Fallback constraint if seller has no plan activated in DB (safe defaults)
export const DEFAULT_SELLER_LIMITS = { maxUploads: 50, maxPrice: 249 };
