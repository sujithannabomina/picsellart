// src/pages/Faq.jsx
export default function Faq() {
  return (
    <div className="pageWrap">
      <h2 className="pageTitle">Frequently Asked Questions</h2>

      <details open>
        <summary>What is Picsellart?</summary>
        <p>Picsellart is a marketplace where creators sell photos and visuals with instant, verified delivery.</p>
      </details>

      <details>
        <summary>How do I become a seller?</summary>
        <p>Create an account, choose a plan, upload images, and start selling from your dashboard.</p>
      </details>

      <details>
        <summary>How are images delivered?</summary>
        <p>After payment, buyers receive a license and a direct download link to the original file.</p>
      </details>

      <details>
        <summary>What is your refund policy?</summary>
        <p>See our <a href="/refunds">Refunds</a> page for full details and timelines.</p>
      </details>
    </div>
  );
}
