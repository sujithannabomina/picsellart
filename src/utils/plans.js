// src/utils/plans.js
// Central definition of seller plans (must match your business rules)

export const SELLER_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 100, // INR
    maxUploads: 25,
    maxPricePerImage: 199,
    durationDays: 180,
    highlight: "Good for testing the platform",
  },
  {
    id: "pro",
    name: "Pro",
    price: 300,
    maxUploads: 30,
    maxPricePerImage: 249,
    durationDays: 180,
    highlight: "For active hobby photographers",
  },
  {
    id: "elite",
    name: "Elite",
    price: 800,
    maxUploads: 50,
    maxPricePerImage: 249,
    durationDays: 180,
    highlight: "For serious sellers and studios",
  },
];

export const getPlanById = (id) =>
  SELLER_PLANS.find((plan) => plan.id === id) || null;
