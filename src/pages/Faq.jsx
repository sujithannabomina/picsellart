// src/pages/Faq.jsx
const faqs = [
  {
    q: "What is Picsellart?",
    a: "Picsellart is a curated marketplace where photographers and creators sell high-quality digital images to designers, agencies and brands.",
  },
  {
    q: "How do I become a seller?",
    a: "Choose a seller plan, sign in with Google and upload your approved images. You set your own price within the plan limits.",
  },
  {
    q: "How are images delivered to buyers?",
    a: "After successful Razorpay payment, buyers receive instant access to a clean, watermark-free download from their dashboard.",
  },
  {
    q: "Do images have watermarks?",
    a: "Public previews on Explore and View are watermarked. Purchased downloads are full-resolution and watermark-free.",
  },
  {
    q: "What is your refund policy?",
    a: "Because files are instantly downloadable, refunds are only offered when a file is corrupt, incomplete or does not match the listing description.",
  },
  {
    q: "Can I use images commercially?",
    a: "Yes, unless a listing clearly says otherwise. Each file includes a standard commercial license. Reselling or redistributing the raw files is not allowed.",
  },
];

const Faq = () => {
  return (
    <main className="page-shell">
      <section className="page-header-block">
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="page-subtitle">
          Answers to common questions about buying and selling on Picsellart.
        </p>
      </section>

      <section className="page-card">
        <dl className="faq-list">
          {faqs.map((item) => (
            <div key={item.q} className="faq-item">
              <dt className="faq-question">{item.q}</dt>
              <dd className="faq-answer">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
};

export default Faq;
