export const PLANS = {
  starter: { key: 'starter', label: 'Starter', amount: 10000, uploads: 50, min: 100, max: 180 },
  plus:    { key: 'plus',    label: 'Plus',    amount: 29900, uploads: 100, min: 100, max: 250 },
  pro:     { key: 'pro',     label: 'Pro',     amount: 79900, uploads: 300, min: 100, max: 500 },
}
// helper
export function getPlanConfig(key) {
  return PLANS[key] || PLANS.starter
}
