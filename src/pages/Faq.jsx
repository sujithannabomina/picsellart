// FILE PATH: src/pages/Faq.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const FAQ = [
  {
    q: "How does PicSellArt work?",
    a: "Explore photos, view watermarked previews, and purchase as a buyer. After payment verification, you can download the watermark-free file from your Buyer Dashboard.",
  },
  {
    q: "What does a seller plan include?",
    a: "Seller plans enable uploads with limits. Your dashboard shows uploads remaining, plan validity, and upgrade options.",
  },
  {
    q: "Are the photos licensed?",
    a: "Yes. Each purchase grants a standard digital license for permitted usage. Misuse or redistribution is not allowed.",
  },
  {
    q: "Why are previews watermarked?",
    a: "To protect seller content. After purchase, the buyer receives the clean original (watermark-free).",
  },
  {
    q: "Do you support refunds?",
    a: "Refunds depend on verification and policy terms. See the Refunds page for details.",
  },
  {
    q: "How do sellers get paid?",
    a: "Sellers earn 80% of every sale. Payouts are made manually via UPI to the UPI ID you provide during onboarding. Weekly payouts for pending earnings.",
  },
  {
    q: "How do I contact support?",
    a: "Email us at admin@picsellart.com or use the Contact page. We typically respond within 24–48 hours.",
  },
];

export default function Faq() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ✅ SEO Helmet */}
      <Helmet>
        <title>FAQ — PicSellArt</title>
        <meta name="description" content="Frequently asked questions about buying and selling photos on PicSellArt. Learn about plans, pricing, UPI payouts, licensing, and how the marketplace works." />
        <link rel="canonical" href="https://www.picsellart.com/faq" />
        <meta property="og:title" content="FAQ — PicSellArt" />
        <meta property="og:description" content="Answers to common questions about buying and selling Indian stock photos on PicSellArt." />
        <meta property="og:url" content="https://www.picsellart.com/faq" />
      </Helmet>

      <div className="rounded-3xl border bg-white p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">FAQ</h1>
            <p className="mt-2 text-gray-600">
              Answers to the most common questions about buying, selling, and licenses.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Contact Support
          </Link>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl border p-6">
              <div className="font-semibold text-gray-900">{f.q}</div>
              <div className="mt-2 text-gray-600 leading-relaxed">{f.a}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 border p-6">
          <div className="font-semibold text-gray-900">Need help quickly?</div>
          <div className="mt-1 text-gray-600">
            If you have a payment issue or download problem, email us at{" "}
            <a href="mailto:admin@picsellart.com" className="text-purple-600 hover:underline font-medium">
              admin@picsellart.com
            </a>{" "}
            with your email and purchase reference.
          </div>
        </div>
      </div>
    </div>
  );
}