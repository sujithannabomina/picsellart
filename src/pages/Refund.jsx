// src/pages/Refund.jsx
export default function Refund(){
  return (
    <div className="container py-10 space-y-6">
      <h1>Refund & Resolution Policy</h1>
      <p>We want every purchase on Picsellart to be safe and satisfactory. This policy explains when you’re eligible for a refund, how to request one, and what happens next.</p>

      <section>
        <h2>When refunds are approved</h2>
        <ul className="list-disc pl-6 space-y-1 text-slate-700">
          <li>Duplicate charge for the same order.</li>
          <li>File corruption where a working replacement can’t be provided promptly.</li>
          <li>Wrong file delivered and we cannot supply the correct one.</li>
          <li>Technical delivery failure after successful payment.</li>
        </ul>
      </section>

      <section>
        <h2>Not eligible for refund</h2>
        <ul className="list-disc pl-6 space-y-1 text-slate-700">
          <li>Change of mind after successful download.</li>
          <li>Use of the image after purchase is later disputed.</li>
          <li>Orders older than 7 days.</li>
          <li>Violations of license terms or suspected abuse.</li>
        </ul>
      </section>

      <section>
        <h2>How to request a refund</h2>
        <ol className="list-decimal pl-6 space-y-1 text-slate-700">
          <li>Go to the Contact page and choose “Refund”.</li>
          <li>Include your order ID, purchase email, and a brief description.</li>
          <li>Attach screenshots or error messages if relevant.</li>
        </ol>
      </section>
    </div>
  );
}
