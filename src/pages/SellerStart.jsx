import Page from '../components/Page'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PLANS, PLAN_ORDER, getPlanConfig } from '../utils/plans.js'

export default function SellerStart() {
  const [plan, setPlan] = useState('starter')
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('seller_plan_id')
    if (saved && PLANS[saved]) setPlan(saved)
  }, [])

  function chooseAndContinue() {
    const chosen = getPlanConfig(plan)
    localStorage.setItem('seller_plan_id', chosen.id)
    localStorage.setItem('seller_plan_amount', String(chosen.amount))
    localStorage.setItem('seller_plan_name', chosen.name)
    localStorage.setItem('seller_plan_uploadLimit', String(chosen.uploadLimit))
    localStorage.setItem('seller_plan_minPrice', String(chosen.minPrice))
    localStorage.setItem('seller_plan_maxPrice', String(chosen.maxPrice))
    navigate('/seller/login')
  }

  return (
    <Page title="Choose a Seller Plan">
      <div className="grid md:grid-cols-3 gap-6">
        {PLAN_ORDER.map(id => {
          const p = PLANS[id]
          const selected = plan === id
          return (
            <label key={p.id} className={`card p-5 cursor-pointer border-2 ${selected ? 'border-blue-600' : 'border-transparent'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">{p.name}</div>
                  <div className="text-3xl font-bold mt-1">₹{p.rupees.toFixed(2)}</div>
                </div>
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={selected}
                  onChange={() => setPlan(p.id)}
                  className="h-5 w-5"
                />
              </div>
              <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
                <li>{p.uploadLimit} photo uploads</li>
                <li>Set price between ₹{p.minPrice/100}–₹{p.maxPrice/100}</li>
                <li>Valid for 1 year</li>
              </ul>
            </label>
          )
        })}
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
