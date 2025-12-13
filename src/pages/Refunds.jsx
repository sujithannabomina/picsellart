// src/pages/Refunds.jsx
import React from "react";

export default function Refunds() {
  const lastUpdated = "13 December 2025";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Refunds &amp; Cancellations
              </h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                Picsellart provides instant digital downloads. Because digital files can’t be “returned”,
                refund eligibility is limited. Please read this policy carefully before purchasing.
              </p>
              <div className="mt-3 text-xs text-slate-500">
                Last updated: <span className="font-semibold text-slate-700">{lastUpdated}</span>
              </div>
            </div>

            <a
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 md:w-auto"
            >
              Request support →
            </a>
          </div>

          {/* AT A GLANCE */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
            <div className="text-sm font-semibold text-slate-900">At a glance</div>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <li className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Change-of-mind</div>
                <div className="mt-1">No refunds for “I don’t need this anymore”.</div>
              </li>
              <li className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">File issues</div>
                <div className="mt-1">Refunds considered for corrupt/incomplete/inaccessible/mismatch.</div>
              </li>
              <li className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Typical timeline</div>
                <div className="mt-1">
                  <span className="font-semibold">1–2 business days</span> review +{" "}
                  <span className="font-semibold">3–7 business days</span> bank processing.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Refund eligibility</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  <li>
                    Refunds are not offered for change-of-mind or requests like “I don’t need this file anymore.”
                  </li>
                  <li>
                    If a delivered file is <span className="font-semibold">corrupt</span>,{" "}
                    <span className="font-semibold">incomplete</span>,{" "}
                    <span className="font-semibold">inaccessible</span>, or{" "}
                    <span className="font-semibold">does not match the listing description</span>, you may request a replacement or a refund.
                  </li>
                  <li>
                    We may approve a refund only after verifying the issue using your order ID/payment reference and file details.
                  </li>
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Refund processing timelines</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Once your request is approved, refunds are typically processed within these timelines:
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-slate-900">Picsellart review</div>
                    <div className="mt-2 text-2xl font-extrabold text-slate-900">1–2</div>
                    <div className="text-sm text-slate-700">business days</div>
                    <div className="mt-2 text-sm text-slate-600">
                      We verify the issue and approve the refund or replacement.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-slate-900">Razorpay / bank processing</div>
                    <div className="mt-2 text-2xl font-extrabold text-slate-900">3–7</div>
                    <div className="text-sm text-slate-700">business days</div>
                    <div className="mt-2 text-sm text-slate-600">
                      Reversal and reflection in your account after approval.
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  Note: Weekends, bank holidays, or additional verification requested by your bank may extend timelines slightly.
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">How to request support</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                  <li>Provide your order ID, Razorpay payment ID/reference, and purchased file name.</li>
                  <li>Describe the problem clearly (e.g., “file not downloading”, “file corrupted”, “wrong file uploaded”).</li>
                  <li>Attach screenshots or error messages if possible (helps us investigate faster).</li>
                  <li>Submit your request using the form on the Contact page.</li>
                </ol>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    Go to Contact →
                  </a>
                  <span className="text-sm text-slate-600">
                    Support hours: <span className="font-semibold text-slate-800">Monday – Friday, 10:00 – 18:00 IST</span>
                  </span>
                </div>
              </section>
            </div>

            {/* Right column */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Abuse &amp; fraud</div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  We actively monitor suspicious activity across accounts. Repeated refund abuse, chargebacks,
                  or unauthorized file sharing may result in account suspension and removal from the marketplace.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Important</div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  By making a purchase on Picsellart, you agree to this Refunds &amp; Cancellations policy
                  in addition to our general terms and any license-specific conditions mentioned on individual listings.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
