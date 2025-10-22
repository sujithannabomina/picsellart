export const PLANS = {
  starter: { id: "starter", label: "Starter", price: 100, maxUploads: 25, maxPricePerImage: 199, days: 180 },
  pro:     { id: "pro",     label: "Pro",     price: 300, maxUploads: 30, maxPricePerImage: 249, days: 180 },
  elite:   { id: "elite",   label: "Elite",   price: 800, maxUploads: 50, maxPricePerImage: 249, days: 180 },
};

export function getPlanById(id) {
  return PLANS[id] || null;
}
