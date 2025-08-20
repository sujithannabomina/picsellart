// Central source of truth for seller plans (prices are in paise)

export const PLANS = {
  starter: { id: 'starter', name: 'Starter', rupees: 100, amount: 10000, uploadLimit: 50,  minPrice: 10000, maxPrice: 18000 },
  plus:    { id: 'plus',    name: 'Plus',    rupees: 299, amount: 29900, uploadLimit: 100, minPrice: 10000, maxPrice: 25000 },
  pro:     { id: 'pro',     name: 'Pro',     rupees: 799, amount: 79900, uploadLimit: 300, minPrice: 10000, maxPrice: 50000 },
}

export const PLAN_ORDER = ['starter', 'plus', 'pro']

export function getPlanConfig(id) {
  return PLANS[id] || PLANS.starter
}

// Accepts Firestore Timestamp or JS date/ms and returns true if > 1 year old
export function isExpired(activatedAt) {
  let ms
  if (!activatedAt) return true
  if (typeof activatedAt?.toDate === 'function') ms = activatedAt.toDate().getTime()
  else if (activatedAt instanceof Date) ms = activatedAt.getTime()
  else if (typeof activatedAt === 'number') ms = activatedAt
  else return true
  const YEAR = 365 * 24 * 60 * 60 * 1000
  return (Date.now() - ms) > YEAR
}
