// src/utils/plans.js

// Picsellart seller plans
export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 100,           // INR
    maxUploads: 25,
    maxPrice: 199,        // per image
    durationDays: 180,
  },
  {
    id: "pro",
    name: "Pro",
    price: 300,
    maxUploads: 30,
    maxPrice: 249,
    durationDays: 180,
  },
  {
    id: "elite",
    name: "Elite",
    price: 800,
    maxUploads: 50,
    maxPrice: 249,
    durationDays: 180,
  },
];

export function getPlanById(id) {
  return PLANS.find((p) => p.id === id) || null;
}
