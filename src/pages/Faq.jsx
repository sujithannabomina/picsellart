export default function FAQ() {
  const QA = [
    ["What is Picsellart?", "A curated marketplace for high-quality, license-ready images."],
    ["How do I become a seller?", "Sign in as Seller, purchase a plan, then upload from your dashboard."],
    ["How are images delivered?", "After payment, buyers get an instant download of the original file."],
    ["Do images have watermarks?", "Previews show a light watermark. Purchased files are clean."],
    ["Commercial usage?", "See each asset’s license. Generally permitted for commercial projects."],
    ["Support?", "Use the Contact page — we reply in 24–48 hours."],
  ];

  return (
    <section className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {QA.map(([q, a]) => (
          <details key={q} className="card px-5 py-4">
            <summary className="font-semibold cursor-pointer">{q}</summary>
            <p className="text-slate-600 mt-2">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
