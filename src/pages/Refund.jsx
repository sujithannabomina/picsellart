// /src/pages/Refund.jsx
export default function Refund() {
  return (
    <main className="page container">
      <h2>Refund & Resolution Policy</h2>
      <p>
        We want every purchase on Picsellart to be safe and satisfactory. This policy explains eligibility,
        how to request a refund, and what happens next.
      </p>

      <h3>When refunds are approved</h3>
      <ul>
        <li>Duplicate charge for the same order.</li>
        <li>Corrupt file where a working replacement can’t be provided promptly.</li>
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

      <h3>Refund timeline</h3>
      <p>
        Approved refunds are initiated within 2 business days; banks/payment gateways may take up to 5–7
        business days to reflect the amount in your account.
      </p>

      <h3>How to request a refund</h3>
      <ol>
        <li>Go to the Contact page and choose “Refund”.</li>
        <li>Include your order ID, purchase email, and a short description.</li>
        <li>Attach screenshots or error messages if relevant.</li>
      </ol>
    </main>
  );
}
