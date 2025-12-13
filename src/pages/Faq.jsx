import React, { useMemo, useState } from "react";

const faqsData = [
  {
    q: "What is Picsellart?",
    a: "Picsellart is a curated marketplace where photographers and creators from India sell high-quality digital images to designers, agencies, brands, and individual buyers.",
  },
  {
    q: "How do I become a seller?",
    a: "Choose a seller plan, complete the Razorpay payment, and sign in with your Google account. Once approved, you can upload images within your plan limits and track views, sales, and earnings from your seller dashboard.",
  },
  {
    q: "How are images delivered to buyers?",
    a: "After successful payment, buyers get instant access to a clean, full-resolution download from their buyer dashboard. Public previews remain watermarked.",
  },
  {
    q: "Do images have watermarks?",
    a: "Yes. Public previews on Explore and View pages include a Picsellart watermark for protection. Purchased downloads are watermark-free.",
  },
  {
    q: "What is your refund policy?",
    a: "Because images are instantly downloadable digital files, refunds are only considered if a file is corrupt, incomplete, inaccessible, or clearly does not match the listing description. Requests are handled via the Refunds/Contact pages.",
  },
  {
    q: "Can I use purchased images commercially?",
    a: "Yes. Unless a listing clearly mentions otherwise, each download includes a standard commercial license for use in designs, ads, social media, presentations, and client work. Reselling or redistributing the raw files is not allowed.",
  },
];

function Chevron({ open }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Faq() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqsData;
    return faqsData.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10">
          <p className="text-sm font-medium text-slate-500">Support</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Quick answers about buying and selling on Picsellart. If you can’t
            find what you need, use the Contact page and we’ll help you.
          </p>

          {/* Search */}
          <div className="mt-6">
            <label className="sr-only" htmlFor="faq-search">
              Search FAQs
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                id="faq-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search: refunds, watermark, commercial license…"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="mt-8 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
              No results. Try different keywords or contact support.
            </div>
          ) : (
            filtered.map((item, idx) => {
              // keep stable open behavior even after filtering
              const actualIndex = faqsData.findIndex((x) => x.q === item.q);
              const open = openIndex === actualIndex;

              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : actualIndex)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-slate-50"
                    aria-expanded={open}
                  >
                    <span className="text-base font-semibold text-slate-900 sm:text-lg">
                      {item.q}
                    </span>
                    <span className="text-slate-500">
                      <Chevron open={open} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-200 ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Still need help? Visit{" "}
              <span className="font-semibold text-slate-900">Contact</span> and
              our team replies within <span className="font-semibold">24–48 hours</span>.
            </p>
            <div className="text-sm text-slate-500">
              Tips: Include order ID + file name for faster support.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
