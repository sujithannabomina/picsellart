import React, { useMemo } from "react";

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export default function Refunds() {
  const lastUpdated = useMemo(() => {
    // You can hardcode if you prefer
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md shadow-sm p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Pill>Policy</Pill>
            <Pill>Digital downloads</Pill>
            <Pill>Refund timelines included</Pill>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Refunds & Cancellations
          </h1>

          <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">
            Picsellart provides instant digital downloads. Because digital files
            can’t be “returned,” refund eligibility is limited. Please read this
            policy carefully before purchasing.
          </p>

          <div className="mt-3 text-sm text-slate-500">
            Last updated: <span className="font-semibold text-slate-700">{lastUpdated}</span>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left summary card */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="font-semibold text-slate-900">At a glance</div>
                <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc pl-5">
                  <li>No refunds for change-of-mind.</li>
                  <li>
                    Refunds considered only for file issues (corrupt, incomplete,
                    inaccessible, or mismatch).
                  </li>
                  <li>
                    Typical timeline: <b>1–2 business days</b> review +{" "}
                    <b>3–7 business days</b> bank processing.
                  </li>
                </ul>

                <a
                  href="/contact"
                  className="mt-5 inline-flex items-center justify-center w-full rounded-2xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-sm hover:opacity-95"
                >
                  Request support
                </a>
              </div>
            </div>

            {/* Main policy */}
            <div className="lg:col-span-2 space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Refund eligibility
                </h2>

                <ul className="mt-4 text-slate-700 space-y-3 list-disc pl-5">
                  <li>
                    Refunds are not offered for change-of-mind or requests like{" "}
                    <span className="font-semibold">
                      “I don’t need this file anymore.”
                    </span>
                  </li>
                  <li>
                    If a delivered file is{" "}
                    <span className="font-semibold">
                      corrupt, incomplete, inaccessible, or does not match the
                      listing description
                    </span>
                    , you may request a replacement or a refund.
                  </li>
                  <li>
                    We may approve a refund only after verifying the issue using your{" "}
                    <span className="font-semibold">order ID</span>,{" "}
                    <span className="font-semibold">payment reference</span>, and{" "}
                    <span className="font-semibold">file details</span>.
                  </li>
                </ul>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Refund processing timelines
                </h2>

                <p className="mt-3 text-slate-600">
                  Once your request is approved, refunds are typically processed
                  within these timelines:
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-slate-900">
                      Picsellart review
                    </div>
                    <div className="mt-2 text-slate-700">
                      <span className="text-2xl font-extrabold">1–2</span>{" "}
                      <span className="text-sm">business days</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      We verify the issue and approve the refund/replacement.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-semibold text-slate-900">
                      Razorpay / bank processing
                    </div>
                    <div className="mt-2 text-slate-700">
                      <span className="text-2xl font-extrabold">3–7</span>{" "}
                      <span className="text-sm">business days</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      Payment reversal and reflection in your account.
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600">
                  Note: weekends, bank holidays, or additional verification requested by your bank
                  may extend these timelines slightly.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  How to request support
                </h2>

                <ol className="mt-4 text-slate-700 space-y-2 list-decimal pl-5">
                  <li>
                    Provide your <b>order ID</b>, <b>Razorpay payment ID</b>, and <b>file name</b>.
                  </li>
                  <li>
                    Describe the issue clearly (e.g., “file not downloading”, “file corrupted”).
                  </li>
                  <li>Attach screenshots or error messages if possible.</li>
                  <li>Submit your request using the form on the Contact page.</li>
                </ol>

                <div className="mt-5">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-sm hover:opacity-95"
                  >
                    Go to Contact page
                  </a>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Abuse & fraud
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  We actively monitor suspicious activity across accounts. Repeated refund abuse,
                  chargebacks, or unauthorized file sharing may result in account suspension and
                  removal from the Picsellart marketplace.
                </p>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <span className="font-semibold">Important:</span> By making a purchase on Picsellart,
                  you agree to this Refunds & Cancellations policy in addition to our Terms and
                  any license-specific conditions mentioned on individual listings.
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
