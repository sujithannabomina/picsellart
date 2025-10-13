import Page from '../components/Page'

export default function BuyerDashboard() {
  return (
    <Page title="Buyer Dashboard">
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Purchased">Your purchased photos will appear here.</Card>
        <Card title="Transactions">Payment history.</Card>
        <Card title="Licenses">License keys / terms.</Card>
      </div>
      <div className="mt-6">
        <Card title="Liked">Saved photos you liked.</Card>
      </div>
    </Page>
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
