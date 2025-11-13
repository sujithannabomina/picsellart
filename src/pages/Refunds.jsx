export default function Refunds() {
  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-extrabold">Refunds & Cancellations</h1>

      <div className="card p-5">
        <h3 className="font-semibold mb-2">Eligibility</h3>
        <ul className="list-disc pl-6 text-slate-700 space-y-1">
          <li>Digital downloads aren’t refundable for change of mind.</li>
          <li>If a file is corrupt or not as described, contact us within <b>48 hours</b>.</li>
          <li>We may replace the file, issue store credit, or refund at our discretion.</li>
        </ul>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-2">How to request</h3>
        <ol className="list-decimal pl-6 text-slate-700 space-y-1">
          <li>Include order ID and affected file name.</li>
          <li>Explain the issue; attach screenshots if possible.</li>
          <li>We reply within 2 business days.</li>
        </ol>
      </div>
    </section>
  );
}
