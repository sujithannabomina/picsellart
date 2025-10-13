import Page from '../components/Page'
import { useAuth } from '../context/AuthContext'

export default function SellerDashboard() {
  const { user, profile, sellerActive } = useAuth()
  const sub = profile?.subscription

  return (
    <Page title="Seller Dashboard">
      <div className="grid md:grid-cols-3 gap-6">
        <Stat title="Uploads allowed" value={sub?.uploadsAllowed ?? 0} />
        <Stat title="Uploads used" value={sub?.uploadsUsed ?? 0} />
        <Stat title="Plan" value={sub?.plan ? sub.plan.toUpperCase() : '—'} />
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <Card title="Most Sold">Coming soon</Card>
        <Card title="Total Earnings">Manual settlement (10% fee)</Card>
        <Card title="Price Range">₹{sub?.minPrice} – ₹{sub?.maxPrice}</Card>
      </div>

      {!sellerActive && (
        <div className="mt-6 text-red-600">Your plan is not active. Please renew.</div>
      )}
    </Page>
  )
}

function Stat({ title, value }) {
  return (
    <div className="border rounded-2xl p-5">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  )
}
function Card({ title, children }) {
  return (
    <div className="border rounded-2xl p-5">
      <div className="text-lg font-semibold mb-2">{title}</div>
      <div className="text-gray-700">{children}</div>
    </div>
  )
}
