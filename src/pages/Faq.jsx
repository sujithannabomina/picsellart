import { useState } from "react";

const QA = [
  {
    q: "What is Picsellart?",
    a: "A marketplace to buy and sell licensed photos. Instant downloads after secure payment.",
  },
  { q: "How do I become a seller?", a: "Create a seller account, purchase a plan, then upload from the Seller Dashboard." },
  { q: "How are images delivered?", a: "Buyers receive a download link immediately after successful payment." },
  { q: "What is your refund policy?", a: "Covered for duplicate purchases or corrupted files within 7 days." },
];

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {QA.map((it, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-base font-semibold text-gray-900 hover:text-indigo-700">
                {it.q}
              </span>
              <span className="select-none rounded-lg border px-2 py-0.5 text-xs text-gray-500">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <p className="mt-3 cursor-text text-sm text-gray-600">
                {it.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
