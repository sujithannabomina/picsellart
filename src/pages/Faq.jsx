export default function Faq(){
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Frequently Asked Questions</h2>
      <details className="border rounded-xl p-4 mb-3">
        <summary className="font-semibold">What is Picsellart?</summary>
        <p className="mt-2">A marketplace to buy and sell licensed photos. Instant downloads after secure payment.</p>
      </details>
      <details className="border rounded-xl p-4 mb-3">
        <summary className="font-semibold">How do I become a seller?</summary>
        <p className="mt-2">Create a seller account, purchase a plan, then upload from the Seller Dashboard.</p>
      </details>
      <details className="border rounded-xl p-4 mb-3">
        <summary className="font-semibold">How are images delivered?</summary>
        <p className="mt-2">Buyers receive a download link immediately after successful payment.</p>
      </details>
      <details className="border rounded-xl p-4 mb-3">
        <summary className="font-semibold">What is your refund policy?</summary>
        <p className="mt-2">Covered for duplicate purchases or corrupted files within 7 days.</p>
      </details>
    </div>
  );
}
