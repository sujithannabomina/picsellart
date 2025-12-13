// src/pages/Faq.jsx
import React, { useMemo, useState } from "react";

const FAQS = [
  {
    q: "What is Picsellart?",
    a: "Picsellart is a curated marketplace where photographers and creators sell high-quality digital images to designers, agencies, brands, and individual buyers."
  },
  {
    q: "How do I become a seller?",
    a: "Choose a seller plan, complete the payment, and sign in with your account. Once your seller account is approved, you can upload images within your plan limits and track views, sales, and earnings from your dashboard."
  },
  {
    q: "How are images delivered to buyers?",
    a: "After successful payment, buyers get instant access to a clean, full-resolution download from their buyer dashboard. Public previews on the Explore page remain watermarked."
  },
  {
    q: "Do images have watermarks?",
    a: "Yes. Public previews on Explore and View pages include a Picsellart watermark for protection. Purchased downloads are watermark-free."
  },
  {
    q: "What is your refund policy?",
    a: "Because images are instantly downloadable digital files, refunds are not offered for change-of-mind. Refunds may be considered only if the delivered file is corrupt, incomplete, inaccessible, or clearly does not match the listing description."
  },
  {
    q: "How long do refunds take?",
    a: "If approved, we typically take 1–2 business days to review and approve a request, plus 3–7 business days for Razorpay/bank processing to reflect the refund in your account."
  },
  {
    q: "Can I use purchased images commercially?",
    a: "Yes. Unless a listing explicitly states otherwise, each purchase includes a standard commercial license for use in designs, ads, social media, presentations, and client work. Reselling or redistributing the raw files is not allowed."
  }
];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Chevron({ open }) {
  return (
    <svg
      className={classNames(
        "h-5 w-5 transition-transform duration-200",
        open ? "rotate-180" : "rotate-0"
      )}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Faq() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return FAQS;
    return FAQS.filter(
      (x) =>
        x.q.toLowerCase().includes(t) || x.a.toLowerCase().includes(t)
    );
  }, [query]);

  // Keep openIndex valid when filtering
  React.useEffect(() => {
    if (filtered.length === 0) return;
    if (openIndex >= filtered.length) setOpenIndex(0);
  }, [filtered, openIndex]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Quick answers about buying and selling on Picsellart. If you can’t find what you need,
                use the Contact page and we’ll help you.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <label className="text-sm font-medium text-slate-700">
                Search FAQs
              </label>
              <div className="mt-2 relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: refunds, watermark, seller..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-300 focus:shadow"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                No results found. Try a different keyword.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                {filtered.map((item, idx) => {
                  const open = idx === openIndex;
                  return (
                    <div key={item.q} className="p-0">
                      <button
                        type="button"
                        className="w-full px-5 py-4 text-left transition hover:bg-slate-50 focus:outline-none"
                        onClick={() => setOpenIndex(open ? -1 : idx)}
                        aria-expanded={open}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-base font-semibold text-slate-900">
                            {item.q}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <span className="text-xs font-medium">
                              {open ? "Hide" : "Show"}
                            </span>
                            <Chevron open={open} />
                          </div>
                        </div>
                      </button>

                      {open && (
                        <div className="px-5 pb-5 -mt-1">
                          <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                            {item.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-bold text-slate-900">
                  Still have questions?
                </div>
                <div className="text-slate-600">
                  Visit the Contact page and our team will get back to you within 24–48 hours.
                </div>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Contact support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
