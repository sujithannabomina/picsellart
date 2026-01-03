import React from "react";

export default function Faq() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
      <p className="text-gray-600 mt-2">Quick answers about buying and selling on Picsellart.</p>

      <div className="mt-8 space-y-4">
        <div className="p-5 bg-white rounded-2xl border">
          <h3 className="font-semibold">What is Picsellart?</h3>
          <p className="text-gray-600 mt-2">
            Picsellart is a curated marketplace where creators sell licensed digital images.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border">
          <h3 className="font-semibold">How do I buy an image?</h3>
          <p className="text-gray-600 mt-2">
            Open Explore → View → Buy. If you’re not logged in, you’ll be redirected to Buyer Login.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border">
          <h3 className="font-semibold">Do I get watermark-free file after purchase?</h3>
          <p className="text-gray-600 mt-2">
            Yes. Buyers receive the original file after successful payment verification.
          </p>
        </div>
      </div>
    </main>
  );
}
