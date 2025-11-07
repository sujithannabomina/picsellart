// src/pages/Faq.jsx
import Header from "../components/Header";

const items = [
  {
    q: "What is Picsellart?",
    a: "A marketplace to sell photos/designs with secure payments and instant, verified delivery.",
  },
  {
    q: "How do I become a seller?",
    a: "Sign in as a seller, choose a plan (coming soon), and upload images. We verify files automatically.",
  },
  {
    q: "How are images delivered to buyers?",
    a: "After successful payment, buyers receive a unique, verified download link.",
  },
  { q: "Do images have watermarks?", a: "Previews are watermarked; downloads are clean." },
  {
    q: "What’s your refund policy?",
    a: "Digital goods are typically non-refundable. If a file is corrupt or wrong, contact us within 48 hours.",
  },
  {
    q: "Can I use images commercially?",
    a: "Unless otherwise stated, purchases grant standard commercial usage. Some assets may have specific license terms.",
  },
  { q: "How do I contact support?", a: "Use the Contact page—we reply within 24–48 hours." },
];

export default function Faq() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h1>
        <div className="mt-6 space-y-4">
          {items.map((it) => (
            <details key={it.q} className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">{it.q}</summary>
              <p className="mt-2 text-slate-700">{it.a}</p>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}
