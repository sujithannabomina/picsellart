import { useEffect, useState } from 'react'
import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'
import { PLANS } from '../utils/plans'
import { useNavigate } from 'react-router-dom'

const ORDER = ['starter','plus','pro']

export default function SellerStart() {
  const { user, role, sellerActive, loading } = useAuth()
  const nav = useNavigate()
  const [sel, setSel] = useState('starter')

  useEffect(() => {
    if (loading) return
    if (!user) nav('/seller/login', { replace: true })
    else if (role !== 'seller') nav('/seller/onboarding', { replace: true })
    else if (sellerActive) nav('/seller/dashboard', { replace: true })
  }, [user, role, sellerActive, loading])

  function go() {
    nav(`/seller/subscribe?plan=${sel}`, { replace: true })
  }

  return (
    <Page title="Choose a Seller Plan">
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {ORDER.map((k) => {
          const p = PLANS[k]
          const checked = sel === k
          return (
            <label
              key={k}
              className={`block border rounded-2xl p-6 cursor-pointer ${checked ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
              onClick={() => setSel(k)}
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">{p.label}</div>
                <input type="radio" readOnly checked={checked} />
              </div>
              <div className="text-3xl font-bold mt-2">₹{(p.amount/100).toFixed(2)}</div>
              <ul className="mt-4 text-gray-700 space-y-2">
                <li>{p.uploads} photo uploads</li>
                <li>Set price between ₹{p.min}–₹{p.max}</li>
                <li>Valid for 1 year</li>
              </ul>
            </label>
          )
        })}
      </div>

      <div className="flex items-center gap-3 justify-start max-w-5xl mx-auto mt-6">
        <button className="btn bg-blue-600 text-white" onClick={go}>Continue</button>
        <button className="btn btn-outline" onClick={() => nav('/')}>Cancel</button>
      </div>
    </Page>
  )
}
