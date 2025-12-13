// src/pages/Faq.jsx
import React, { useState } from "react";

const faqs = [
  {
    question: "What is Picsellart?",
    answer:
      "Picsellart is a curated marketplace where photographers and creators from India sell high-quality digital images to designers, brands, agencies, and individual buyers.",
  },
  {
    question: "How do I become a seller?",
    answer:
      "Choose a seller plan, complete the Razorpay payment, and sign in with your Google account. Once approved, you can upload images within your plan limits and track sales from your seller dashboard.",
  },
  {
    question: "How are images delivered to buyers?",
    answer:
      "After a successful Razorpay payment, buyers instantly get access to a clean, full-resolution file from their Picsellart buyer dashboard. The public preview remains watermarked.",
  },
  {
    question: "Do images have watermarks?",
    answer:
      "Yes. Public previews on Explore and View pages include a Picsellart watermark for protection. All purchased downloads are watermark-free.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Because images are instantly downloadable digital files, refunds are only considered if a file is corrupt, incomplete, inaccessible, or clearly does not match the description. All requests are handled via the Refunds and Contact pages.",
  },
  {
    question: "Can I use purchased images commercially?",
    answer:
      "Yes. Unless a listing clearly mentions otherwise, each download includes a standard commercial license for use in designs, ads, social media, presentations, and client work. Reselling or redistributing the raw files is not allowed.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 via-slate-50/60 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
            Answers to common questions about buying and selling images on
            Picsellart. If you don&apos;t see your question here, feel free to
            reach out through the Contact page.
          </p>
        </header>

        <section className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <div
                key={item.question}
                className="bg-white/80 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5"
                >
                  <span className="text-left">
                    <span className="block text-sm font-medium uppercase tracking-wide text-violet-500 mb-0.5">
                      Question {index + 1}
                    </span>
                    <span className="block text-base sm:text-lg font-semibold text-slate-900">
                      {item.question}
                    </span>
                  </span>

                  {/* Chevron icon */}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-inner transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 8l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-slate-600 transition-all duration-200 ease-out ${
                    isOpen ? "max-h-40 sm:max-h-48 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600">
          Still have questions? Visit the{" "}
          <span className="font-semibold">Contact</span> page and our team will
          get back to you within <span className="font-semibold">24–48 hours</span>.
        </footer>
      </div>
    </main>
  );
}

export default Faq;
