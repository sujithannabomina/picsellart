import React, { useMemo, useState } from "react";

function Chevron({ open }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform duration-200 ${
        open ? "rotate-180" : "rotate-0"
      }`}
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

function FaqItem({ title, body, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/60 backdrop-blur-md shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center gap-3"
        aria-expanded={open}
      >
        <div className="flex-1">
          <div className="text-base sm:text-lg font-semibold text-slate-900">
            {title}
          </div>
        </div>

        <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center">
          <Chevron open={open} />
        </div>
      </button>

      <div
        className={`grid transition-all duration-200 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 text-slate-700 leading-relaxed">
            {body}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const faqs = useMemo(
    () => [
      {
        title: "What is Picsellart?",
        body: (
          <>
            Picsellart is a curated marketplace where photographers and creators
            sell high-quality digital images to designers, agencies, brands, and
            individual buyers. Purchases are delivered as instant digital
            downloads.
          </>
        ),
      },
      {
        title: "How do I become a seller?",
        body: (
          <>
            Choose a seller plan, complete the Razorpay payment, and sign in
            with your Google account. Once approved, you can upload images
            within your plan limits, set prices, and track views/sales from your
            seller dashboard.
          </>
        ),
      },
      {
        title: "How are images delivered to buyers?",
        body: (
          <>
            After successful payment, buyers get access to a clean, full-resolution
            download from their buyer dashboard. Public previews on the website
            remain watermarked.
          </>
        ),
      },
      {
        title: "Do images have watermarks?",
        body: (
          <>
            Yes — previews include a Picsellart watermark for protection.
            Purchased downloads are watermark-free.
          </>
        ),
      },
      {
        title: "What is your refund policy?",
        body: (
          <>
            Because products are instant digital downloads, refunds are only
            considered if the delivered file is corrupt, incomplete, inaccessible,
            or clearly does not match the listing description. Refund timelines
            are shown on the Refunds page.
          </>
        ),
      },
      {
        title: "Can I use purchased images commercially?",
        body: (
          <>
            Yes — unless a listing states otherwise, purchases include a standard
            commercial license for use in designs, ads, social media, presentations,
            and client work. Reselling or redistributing the original files is
            not allowed.
          </>
        ),
      },
    ],
    []
  );

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (x) =>
        x.title.toLowerCase().includes(q) ||
        String(x.body?.props?.children ?? "")
          .toLowerCase()
          .includes(q)
    );
  }, [faqs, query]);

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md shadow-sm p-6 sm:p-10">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Frequently Asked Questions
              </h1>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Quick answers about buying and selling on Picsellart. If you can’t
                find what you need, use the Contact page and we’ll help you.
              </p>
            </div>

            <div className="w-full md:w-[360px]">
              <label className="text-sm font-medium text-slate-700">
                Search FAQs
              </label>
              <div className="mt-2 relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: refunds, watermark, license..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.5 3a5.5 5.5 0 104.25 9.06l2.6 2.6a.75.75 0 101.06-1.06l-2.6-2.6A5.5 5.5 0 008.5 3zm-4 5.5a4 4 0 117.999.001A4 4 0 014.5 8.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
                No results for <span className="font-semibold">“{query}”</span>.
                Try a different keyword.
              </div>
            ) : (
              filtered.map((f, idx) => (
                <FaqItem
                  key={f.title}
                  title={f.title}
                  body={f.body}
                  defaultOpen={idx === 0 && !query}
                />
              ))
            )}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="font-semibold text-slate-900">
                Still have questions?
              </div>
              <div className="text-slate-600">
                Visit the Contact page and our team will reply within 24–48 hours.
              </div>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-sm hover:opacity-95"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
