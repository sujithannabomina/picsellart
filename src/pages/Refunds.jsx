import React from "react";

export default function Refunds() {
  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10">
          <p className="text-sm font-medium text-slate-500">Policy</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Refunds & Cancellations
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Picsellart provides instant digital downloads. Because digital files
            can’t be “returned,” refund eligibility is limited. Please read this
            policy carefully before purchasing.
          </p>

          <div className="mt-5 text-sm text-slate-500">
            Last updated: <span className="font-medium text-slate-700">12 December 2025</span>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Eligibility */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Refund Eligibility
            </h2>

            <ul className="mt-4 space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-violet-500" />
                Refunds are not offered for change-of-mind or requests like “I
                don’t need this file anymore.”
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-violet-500" />
                If a delivered file is <span className="font-semibold">corrupt</span>,{" "}
                <span className="font-semibold">incomplete</span>,{" "}
                <span className="font-semibold">inaccessible</span>, or{" "}
                <span className="font-semibold">does not match the listing description</span>,
                you may request a replacement or refund.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-violet-500" />
                We may approve a refund only after verifying the issue using your
                order ID, payment reference, and file details.
              </li>
            </ul>
          </section>

          {/* Timelines */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Refund Processing Timelines
            </h2>
            <p className="mt-3 text-slate-600">
              Once your request is approved, refunds are typically processed within
              the following timelines:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-900">
                  Picsellart review
                </div>
                <div className="mt-2 text-slate-700">
                  <span className="font-semibold">1–2 business days</span> for our
                  team to verify the issue and approve the refund or replacement.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-900">
                  Razorpay / bank processing
                </div>
                <div className="mt-2 text-slate-700">
                  <span className="font-semibold">3–7 business days</span> for
                  Razorpay or your bank to complete the reversal and reflect it in
                  your account.
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Note: Weekends, bank holidays, or additional verification by your bank
              may extend these timelines slightly.
            </div>
          </section>

          {/* How to request */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              How to Request Support
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
              <li>Provide your order ID, Razorpay payment ID, and file name.</li>
              <li>
                Describe the problem clearly (e.g., “file not downloading”, “file corrupted”, “wrong file uploaded”).
              </li>
              <li>Attach screenshots or error messages if possible.</li>
              <li>Submit your request using the form on the Contact page.</li>
            </ol>
          </section>

          {/* Abuse */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900">Abuse & Fraud</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              We actively monitor suspicious activity across accounts. Repeated refund
              abuse, chargebacks, or unauthorized file sharing may result in account
              suspension and removal from the Picsellart marketplace.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-semibold">Important:</span> By making a purchase on
              Picsellart, you agree to this Refunds & Cancellations policy in addition
              to our general Terms and any license-specific conditions mentioned on
              individual listings.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
