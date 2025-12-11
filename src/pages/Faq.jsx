// src/pages/Faq.jsx
import React from "react";

export default function Faq() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-20 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-10 text-lg leading-relaxed">
        <div>
          <h2 className="text-2xl font-semibold mb-3">What is Picsellart?</h2>
          <p>
            Picsellart is a curated marketplace where photographers and creators
            from India sell high-quality digital images to designers, brands,
            agencies, and individual buyers.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">How do I become a seller?</h2>
          <p>
            Choose a seller plan, complete the Razorpay payment, and sign in with
            your Google account. Once approved, you can upload images within your
            plan limits and track sales from your dashboard.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            How are images delivered to buyers?
          </h2>
          <p>
            After successful Razorpay payment, buyers instantly get access to a
            clean, full-resolution download from their Picsellart buyer dashboard.
            The public preview remains watermarked.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Do images have watermarks?</h2>
          <p>
            Yes. Public previews on Explore and View pages include a Picsellart
            watermark for protection. Purchased downloads are watermark-free.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">What is your refund policy?</h2>
          <p>
            Because images are instantly downloadable digital files, refunds are
            only considered if a file is corrupt, incomplete or clearly does not
            match the description. All such requests are handled via the
            Refunds/Contact page.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">
            Can I use purchased images commercially?
          </h2>
          <p>
            Yes. Unless a listing clearly mentions otherwise, each download
            includes a standard commercial license for use in designs, ads, social
            media, presentations and client work. Reselling or redistributing the
            raw files is not allowed.
          </p>
        </div>
      </div>
    </div>
  );
}
