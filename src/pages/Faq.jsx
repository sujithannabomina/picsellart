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
      "Choose a seller plan on the Become a Seller page, complete the Razorpay payment, and sign in with your Google account. Once approved, you can upload images within your plan limits and track sales from your dashboard.",
  },
  {
    question: "How are images delivered to buyers?",
    answer:
      "After successful Razorpay payment, buyers instantly get access to a clean, full-resolution download from their Picsellart buyer dashboard. Public previews on the Explore and View pages remain watermarked.",
  },
  {
    question: "Do images have watermarks?",
    answer:
      "Yes. Public previews include a Picsellart watermark for protection. Once purchased, the downloadable file is watermark-free.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Because images are instantly downloadable digital files, refunds are only considered if the file is corrupt, incomplete, inaccessible, or clearly does not match the description. All requests are handled via the Refunds & Cancellations policy and the Contact page.",
  },
  {
    question: "Can I use purchased images commercially?",
    answer:
      "Yes. Unless a listing clearly mentions otherwise, each download includes a standard commercial license for use in designs, ads, social media, presentations and client work. Reselling or redistributing the raw file itself is not allowed.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 mb-8">
          Answers to common questions about buying and selling images on
          Picsellart. If you don’t see your question here, feel free to contact
          us.
        </p>

        <div className="space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm sm:text-base font-medium text-slate-900">
                    {item.question}
                  </span>
                  <span
                    className={`ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold transition-transform ${
                      isOpen
                        ? "bg-violet-600 text-white rotate-180 border-violet-600"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    ⌄
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 text-sm text-slate-600 border-t border-slate-100">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-violet-200 bg-violet-50/70 px-5 py-4 text-sm text-slate-700">
          Still have questions?{" "}
          <span className="font-semibold text-violet-700">
            Visit the Contact page
          </span>{" "}
          and our team will get back to you within 24–48 hours.
        </div>
      </div>
    </div>
  );
}

export default Faq;
