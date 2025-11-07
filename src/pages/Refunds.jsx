// src/pages/Refunds.jsx
import Header from "../components/Header";

export default function Refunds() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-4xl font-extrabold text-slate-900">Refunds & Cancellations</h1>
        <p className="mt-2 text-slate-700">
          Picsellart provides digital downloads. We aim to ensure every purchase is exactly as
          described. Please read the policy carefully before buying.
        </p>

        <section className="mt-6 space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">Eligibility</h2>
            <ul className="list-disc ml-5 mt-2 text-slate-700">
              <li>Refunds are not offered for “change of mind.”</li>
              <li>
                If your file is corrupt, incomplete, or not as described, contact us within{" "}
                <strong>48 hours</strong>.
              </li>
              <li>We may replace the file, issue store credit, or refund, at our discretion.</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">How to request</h2>
            <ol className="list-decimal ml-5 mt-2 text-slate-700">
              <li>Provide your order ID and the affected file name.</li>
              <li>Explain the issue with screenshots if possible.</li>
              <li>We’ll review and respond within 2 business days.</li>
            </ol>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-semibold">Abuse & Fraud</h2>
            <p className="mt-2 text-slate-700">
              We monitor suspicious activity. Repeated refund abuse may result in account
              suspension.
            </p>
          </div>

          <p className="mt-6 text-slate-600">
            Questions? <a href="/contact" className="text-indigo-700 underline">Contact us</a>.
          </p>
        </section>
      </main>
    </>
  );
}
