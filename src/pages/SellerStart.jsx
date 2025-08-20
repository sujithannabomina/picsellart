import Page from '../components/Page'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const PLANS = [
  { id: 'starter', name: 'Starter', price: 49900, features: ['Up to 100 uploads', 'Basic analytics'] },
  { id: 'pro', name: 'Pro', price: 99900, features: ['Unlimited uploads', 'Advanced analytics', 'Priority support'] },
]

export default function SellerStart() {
  const [plan, setPlan] = useState('starter')
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('seller_plan_id')
    if (saved) setPlan(saved)
  }, [])

  function chooseAndContinue() {
    const chosen = PLANS.find(p => p.id === plan) || PLANS[0]
    localStorage.setItem('seller_plan_id', chosen.id)
    localStorage.setItem('seller_plan_amount', String(chosen.price))
    localStorage.setItem('seller_plan_name', chosen.name)
    navigate('/seller/login')
  }

  return (
    <Page title="Become a Seller">
      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.map(p => (
          <label key={p.id} className={`card p-5 cursor-pointer border-2 ${plan === p.id ? 'border-blue-600' : 'border-transparent'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold">{p.name}</div>
                <div className="text-3xl font-bold mt-1">₹{(p.price / 100).toFixed(2)}</div>
              </div>
              <input
                type="radio"
                name="plan"
                value={p.id}
                checked={plan === p.id}
                onChange={() => setPlan(p.id)}
                className="h-5 w-5"
              />
            </div>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              {p.features.map(f => <li key={f}>{f}</li>)}
            </ul>
          </label>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={chooseAndContinue} className="btn bg-blue-600 text-white hover:bg-blue-700">
          Continue
        </button>
        <Link to="/" className="btn btn-outline">Cancel</Link>
      </div>
    </Page>
  )
}
