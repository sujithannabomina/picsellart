export default function Faq() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>

      <details className="mb-3" open>
        <summary className="font-semibold">What is Picsellart?</summary>
        <p className="mt-2 opacity-80">
          A marketplace where creators sell photos/designs with secure payments and instant, verified delivery.
        </p>
      </details>

      <details className="mb-3">
        <summary className="font-semibold">How do I become a seller?</summary>
        <p className="mt-2 opacity-80">
          Sign in with Google as a seller, choose a subscription plan, and start uploading. We verify files automatically.
        </p>
      </details>

      <details className="mb-3">
        <summary className="font-semibold">How are images delivered to buyers?</summary>
        <p className="mt-2 opacity-80">
          After successful payment, buyers receive a unique, verified download link. Hotlinking is blocked.
        </p>
      </details>

      <details className="mb-3">
        <summary className="font-semibold">Do images have watermarks?</summary>
        <p className="mt-2 opacity-80">
          Yes on Explore/preview. Purchased files are delivered without watermark.
        </p>
      </details>

      <details className="mb-3">
        <summary className="font-semibold">What’s your refund policy?</summary>
        <p className="mt-2 opacity-80">
          Digital goods are non-refundable once delivered, except for duplicate charges or failed file access.
        </p>
      </details>

      <details className="mb-3">
        <summary className="font-semibold">Can I use images commercially?</summary>
        <p className="mt-2 opacity-80">
          Yes, according to the license shown at checkout. Editorial-only files will be marked.
        </p>
      </details>

      <details className="mb-3">
        <summary className="font-semibold">How do I contact support?</summary>
        <p className="mt-2 opacity-80">
          Use the Contact page form; you’ll get a ticket ID by email.
        </p>
      </details>
    </div>
  );
}
