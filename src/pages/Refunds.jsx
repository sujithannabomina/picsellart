// src/pages/Refunds.jsx
import React from "react";

function Refunds() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
          Refunds &amp; Cancellations
        </h1>
        <p className="text-slate-600 mb-8 max-w-3xl">
          Picsellart provides instant digital downloads. Because digital files
          cannot be “returned”, refund eligibility is limited. Please read this
          policy carefully before making a purchase.
        </p>

        {/* Eligibility */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Refund Eligibility
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            <li>
              Refunds are not offered for change-of-mind or requests like “I
              don’t need this file anymore.”
            </li>
            <li>
              If a delivered file is{" "}
              <span className="font-semibold">
                corrupt, incomplete, inaccessible, or does not match the listing
                description
              </span>
              , you may request a replacement or a refund.
            </li>
            <li>
              We may approve a refund only after verifying the issue using your
              order ID, payment reference and file details.
            </li>
          </ul>
        </section>

        {/* Timeline */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Refund Processing Timelines
          </h2>
          <p className="text-sm text-slate-700 mb-3">
            Once your request is approved, refunds are typically processed
            within the following timelines:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4">
              <p className="text-xs font-semibold tracking-wide text-violet-600 uppercase mb-1">
                Picsellart review
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">1–2 business days</span> for our
                team to verify the issue and approve the refund or replacement.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4">
              <p className="text-xs font-semibold tracking-wide text-violet-600 uppercase mb-1">
                Razorpay / bank processing
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">3–7 business days</span> for
                Razorpay or your bank to complete the reversal and reflect it in
                your account.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Note: Weekends, bank holidays or additional verification by your
            bank may extend these timelines slightly.
          </p>
        </section>

        {/* How to request */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            How to Request Support
          </h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
            <li>Provide your order ID, Razorpay payment ID and file name.</li>
            <li>
              Describe the problem clearly (for example, “file not downloading”,
              “file corrupted”, “wrong file uploaded”).
            </li>
            <li>
              Attach screenshots or error messages if possible to help us
              investigate faster.
            </li>
            <li>
              Submit your request using the form on the{" "}
              <span className="font-semibold">Contact</span> page.
            </li>
          </ol>
        </section>

        {/* Abuse & fraud */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Abuse &amp; Fraud
          </h2>
          <p className="text-sm text-slate-700">
            We actively monitor suspicious activity across accounts. Repeated
            refund abuse, chargebacks or unauthorized file sharing may result in
            account suspension and removal from the Picsellart marketplace.
          </p>
        </section>

        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/80 px-5 py-4 text-xs sm:text-sm text-slate-700">
          <span className="font-semibold text-amber-900">Important:</span> By
          making a purchase on Picsellart, you agree to this Refunds &amp;
          Cancellations policy in addition to our general Terms and any
          license-specific conditions mentioned on individual listings.
        </div>
      </div>
    </div>
  );
}

export default Refunds;
