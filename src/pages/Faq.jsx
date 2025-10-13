export default function Faq() {
  const items = [
    ['What is Picsellart?', 'A marketplace to buy and sell licensed photos.'],
    ['How do I become a seller?', 'Create a seller account, then upload from the Seller Dashboard.'],
    ['How are images delivered?', 'Instant download after successful payment.'],
    ['What is your refund policy?', 'Covered for duplicate purchases or corrupted files.'],
  ]
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {items.map(([q,a]) => (
          <details key={q} className="rounded-xl border p-4">
            <summary className="font-medium cursor-pointer">{q}</summary>
            <p className="mt-2 text-slate-700">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
