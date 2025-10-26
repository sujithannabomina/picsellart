export default function Refund() {
  return (
    <main className="section">
      <div className="container page">
        <h2>Refund &amp; Resolution Policy</h2>
        <p>We want every purchase on Picsellart to be safe and satisfactory. This policy explains when you’re eligible for a refund, how to request one, and what happens next.</p>

        <h3 className="mt-4">When refunds are approved</h3>
        <ul>
          <li>Duplicate charge for the same order.</li>
          <li>File corruption where a working replacement can’t be provided promptly.</li>
          <li>Wrong file delivered and we cannot supply the correct one.</li>
          <li>Technical delivery failure after successful payment.</li>
        </ul>

        <h3>Not eligible for refund</h3>
        <ul>
          <li>Change of mind after successful download.</li>
          <li>Use of the image after purchase is later disputed.</li>
          <li>Orders older than 7 days.</li>
          <li>Violations of license terms or suspected abuse.</li>
        </ul>

        <h3>How to request a refund</h3>
        <ol>
          <li>Go to the <strong>Contact</strong> page and choose <em>Billing</em>.</li>
          <li>Include your order ID, purchase email, and a brief description.</li>
          <li>Attach screenshots or error messages if relevant.</li>
        </ol>

        <p className="muted">Most refunds are reviewed within 3 business days. If approved, funds return to your payment method in 5–10 business days (timeline depends on your bank).</p>
      </div>
    </main>
  );
}
