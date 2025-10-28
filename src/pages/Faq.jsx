// /src/pages/Faq.jsx
export default function Faq() {
  return (
    <main className="page container">
      <h2>Frequently Asked Questions</h2>

      <details open>
        <summary>What is Picsellart?</summary>
        <p>Picsellart is a marketplace for photos/designs. Sellers upload, buyers license & download instantly.</p>
      </details>

      <details>
        <summary>How do I become a seller?</summary>
        <p>Create an account, choose a plan, complete KYC, and upload your images. Payouts are settled to your bank.</p>
      </details>

      <details>
        <summary>How are images delivered?</summary>
        <p>Buyers receive a secure, watermarked preview; originals unlock immediately after successful payment.</p>
      </details>

      <details>
        <summary>What is your refund policy?</summary>
        <p>See the Refunds page for full rules, timelines, and eligibility.</p>
      </details>
    </main>
  );
}
