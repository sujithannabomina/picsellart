// Central place for seller plans (front-end caps must match server).
export const PRICE_PLANS = [
  { id: "starter", name: "Starter", priceINR: 199, maxPricePerPhoto: 199, uploadLimit: 25 },
  { id: "pro",     name: "Pro",     priceINR: 499, maxPricePerPhoto: 499, uploadLimit: 200 },
  { id: "elite",   name: "Elite",   priceINR: 999, maxPricePerPhoto: 999, uploadLimit: 1000 },
];
