// src/pages/Refunds.jsx
import React from "react";

function Refunds() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 via-slate-50/60 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Refunds &amp; Cancellations
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl">
            Picsellart provides instant digital downloads. Because digital files
            cannot be &quot;returned&quot;, refund eligibility is limited.
            Please read this policy carefully before making a purchase.
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Last updated: <span className="font-medium">12 December 2025</span>
          </p>
        </header>

        {/* Refund eligibility */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
            Refund Eligibility
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-slate-700">
            <li>
              Refunds are not offered for change-of-mind or requests like
              &quot;I don&apos;t need this file anymore.&quot;
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
              order ID, payment reference, and file details.
            </li>
          </ul>
        </section>

        {/* Timelines */}
        <section className="mb-8 sm:mb-10 border-t border-slate-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
            Refund Processing Timelines
          </h2>
          <p className="text-sm sm:text-base text-slate-700 mb-3">
            Once your request is approved, refunds are typically processed within
            the following timelines:
          </p>

          <div className="grid gap-4 sm:grid-cols-2 text-sm sm:text-base">
            <div className="rounded-2xl bg-white/80 border border-slate-200 px-4 py-3 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Picsellart review
              </h3>
              <p className="mt-1 text-slate-700">
                <span className="font-medium">1–2 business days</span> for our
                team to verify the issue and approve the refund or replacement.
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 border border-slate-200 px-4 py-3 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Razorpay / bank processing
              </h3>
              <p className="mt-1 text-slate-700">
                <span className="font-medium">3–7 business days</span> for
                Razorpay or your bank to complete the reversal and reflect it in
                your account.
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-500">
            Note: Weekends, bank holidays, or additional verification requested
            by your bank may extend these timelines slightly.
          </p>
        </section>

        {/* How to request support */}
        <section className="mb-8 sm:mb-10 border-t border-slate-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
            How to Request Support
          </h2>
          <ol className="list-decimal list-inside space-y-1.5 text-sm sm:text-base text-slate-700">
            <li>Provide your order ID, Razorpay payment ID, and file name.</li>
            <li>
              Describe the problem clearly (for example, &quot;file not
              downloading&quot;, &quot;file corrupted&quot;, &quot;wrong file
              uploaded&quot;).
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
        <section className="mb-6 border-t border-slate-200 pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
            Abuse &amp; Fraud
          </h2>
          <p className="text-sm sm:text-base text-slate-700">
            We actively monitor suspicious activity across accounts. Repeated
            refund abuse, chargebacks, or unauthorized file sharing may result
            in account suspension and removal from the Picsellart marketplace.
          </p>
        </section>

        <footer className="mt-4 text-xs sm:text-sm text-slate-500 border-t border-slate-200 pt-4">
          Important: By making a purchase on Picsellart, you agree to this{" "}
          <span className="font-semibold">Refunds &amp; Cancellations</span>{" "}
          policy in addition to our general terms and any license-specific
          conditions mentioned on individual listings.
        </footer>
      </div>
    </main>
  );
}

export default Refunds;
