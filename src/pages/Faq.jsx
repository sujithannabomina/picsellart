export default function Faq() {
  const qa = [
    { q: "What is Picsellart?", a: "A marketplace where sellers upload images and buyers purchase licensed downloads." },
    { q: "How do I become a seller?", a: "Sign in with Google on the Seller Login page, choose a pack, and start uploading." },
    { q: "How are images delivered?", a: "Instant download after payment; originals are delivered without the watermark." },
    { q: "What is your refund policy?", a: "Digital goods are non-refundable except in case of duplicate charge or delivery failure." }
  ];
  return (
    <main className="container page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq">
        {qa.map(({q,a}) => (
          <details key={q}>
            <summary>{q}</summary>
            <div>{a}</div>
          </details>
        ))}
      </div>
    </main>
  );
}
