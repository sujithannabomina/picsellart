export default function Faq() {
  return (
    <main className="section">
      <div className="container page">
        <h2>Frequently Asked Questions</h2>

        <details open>
          <summary><strong>What is Picsellart?</strong></summary>
          <p>Picsellart is a marketplace where photographers and creators sell licensed images to designers, architects, and content creators. We handle storage, secure delivery, and verified payments.</p>
        </details>

        <details>
          <summary><strong>How do I become a seller?</strong></summary>
          <p>Create a seller account, choose a plan, and complete payment. You’ll get an upload quota, pricing limits, and a dashboard for uploads, sales, and payouts.</p>
        </details>

        <details>
          <summary><strong>How are images delivered?</strong></summary>
          <p>Buyers receive instant downloads after payment. Previews are auto-watermarked; the original file is delivered securely to the buyer’s account.</p>
        </details>

        <details>
          <summary><strong>Do you review sellers?</strong></summary>
          <p>Yes. We verify seller identity and monitor content quality. Repeated policy violations may suspend the account.</p>
        </details>
      </div>
    </main>
  );
}
