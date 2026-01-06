// FILE: src/utils/plans.js
export const PLANS = {
  starter: { id: "starter", name: "Starter", price: 100, maxUploads: 25, maxPrice: 199, durationDays: 180 },
  pro: { id: "pro", name: "Pro", price: 300, maxUploads: 30, maxPrice: 249, durationDays: 180 },
  elite: { id: "elite", name: "Elite", price: 800, maxUploads: 50, maxPrice: 249, durationDays: 180 },
};

export function formatINR(amount) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}
