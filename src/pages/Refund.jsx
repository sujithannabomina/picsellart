export default function Refund(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-4">Refund &amp; Resolution Policy</h1>
      <p className="text-gray-600 mb-8">
        We want every purchase on Picsellart to be safe and satisfactory. This policy explains when you’re eligible for a refund,
        how to request one, and what happens next.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">When refunds are approved</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><span className="font-medium">Duplicate charge:</span> You were charged more than once for the same order.</li>
          <li><span className="font-medium">File corruption:</span> The downloaded file is corrupted or incomplete and a working
              replacement cannot be provided within a reasonable time.</li>
          <li><span className="font-medium">Wrong file delivered:</span> You received a different file than what was advertised and
              we cannot supply the correct one.</li>
          <li><span className="font-medium">Technical delivery failure:</span> Payment succeeded but you did not receive a download
              link and support can’t restore access within 48 hours.</li>
        </ul>
        <p className="text-sm text-gray-500 mt-2">Note: For issues with license scope or usage, contact us—many can be resolved without a refund.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Not eligible for refund</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><span className="font-medium">Change of mind</span> after successful download.</li>
          <li>Use of the image after purchase that is later disputed.</li>
          <li>Purchases older than <span className="font-medium">7 calendar days</span>.</li>
          <li>Violations of the license terms or suspected abuse.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">How to request a refund</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Go to the <span className="font-medium">Contact</span> page and submit a request with the subject “Refund”.</li>
          <li>Include your <span className="font-medium">order ID</span>, purchase email, and a brief description of the issue.</li>
          <li>Attach screenshots or error messages if relevant.</li>
        </ol>
        <p className="text-gray-600 mt-2">
          Our team will respond within <span className="font-medium">24–48 hours</span>. If approved, the refund will be issued to your
          original payment method within <span className="font-medium">5–7 business days</span> (bank processing times may vary).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Chargebacks</h2>
        <p className="text-gray-600">
          If a chargeback is filed while an investigation is in progress, access to the file and license may be suspended.
          We recommend contacting us first so we can resolve the issue quickly.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Need help?</h2>
        <p className="text-gray-600">
          Email <a href="mailto:support@picsellart.com" className="underline">support@picsellart.com</a> or use the
          Contact form. We’re here to help.
        </p>
      </section>

      <p className="text-xs text-gray-500">Last updated: {new Date().toISOString().slice(0,10)}</p>
    </div>
  );
}
