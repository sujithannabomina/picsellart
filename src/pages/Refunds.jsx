// src/pages/Refunds.jsx
import React from "react";

export default function Refunds() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-20 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Refunds & Cancellations</h1>

      <p className="text-lg leading-relaxed mb-8">
        Picsellart provides instant digital downloads. Because digital files
        cannot be “returned,” refund eligibility is limited. Please review this
        policy carefully before making a purchase.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
      <ul className="list-disc ml-6 mb-8 space-y-2 text-lg">
        <li>
          Refunds are not offered for change-of-mind or requests like “I don’t
          need this file anymore.”
        </li>
        <li>
          If a delivered file is <b>corrupt, incomplete, inaccessible, or does
          not match the listing description</b>, you may request a replacement or
          a refund.
        </li>
        <li>
          We may approve a refund only after verifying the issue with the
          provided order details.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">
        Refund Processing Timelines
      </h2>
      <p className="text-lg leading-relaxed mb-8">
        Once approved, refunds are processed within:
      </p>
      <ul className="list-disc ml-6 mb-8 space-y-2 text-lg">
        <li>
          <b>1–2 business days</b> for us to verify and approve your request.
        </li>
        <li>
          <b>3–7 business days</b> for Razorpay / your bank to complete the
          reversal.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">How to Request Support</h2>
      <ol className="list-decimal ml-6 mb-8 space-y-2 text-lg">
        <li>Provide your order ID and file name.</li>
        <li>
          Describe the problem clearly and attach screenshots if possible.
        </li>
        <li>Submit the request via the Contact page form.</li>
      </ol>

      <h2 className="text-2xl font-semibold mb-4">Abuse & Fraud</h2>
      <p className="text-lg leading-relaxed">
        Repeated refund abuse, chargebacks, or unauthorized file sharing may
        result in account suspension and removal from Picsellart.
      </p>
    </div>
  );
}
