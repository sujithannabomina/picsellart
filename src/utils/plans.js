export const PLANS = [
  { id: 'starter',  price: 100,  currency: 'INR', uploads: 50,  min: 100, max: 180, months: 12 },
  { id: 'plus',     price: 299,  currency: 'INR', uploads: 100, min: 100, max: 250, months: 12 },
  { id: 'pro',      price: 799,  currency: 'INR', uploads: 300, min: 100, max: 500, months: 12 },
]

export const getPlanConfig = (id) => PLANS.find(p => p.id === id)
