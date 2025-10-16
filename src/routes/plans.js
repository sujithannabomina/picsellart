// src/utils/plans.js
export const PLANS = {
  starter: { id: "starter", price: 100, uploadLimit: 25, maxPricePerImage: 199 },
  pro:     { id: "pro",     price: 300, uploadLimit: 30, maxPricePerImage: 249 },
  elite:   { id: "elite",   price: 800, uploadLimit: 50, maxPricePerImage: 249 },
};

// returned by server after verification; UI does not display days anywhere
export const ACCESS_DAYS = 180;
