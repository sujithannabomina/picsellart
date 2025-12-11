// src/pages/Contact.jsx
import React from "react";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In production you would send this to your backend / email service.
    // For now we just prevent page reload.
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr] items-start">
          {/* Left: text + urgent info */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
              Contact Us
            </h1>
            <p className="text-slate-600 mb-6 max-w-xl">
              Send us a message – our support team typically replies within{" "}
              <span className="font-semibold">24–48 hours</span>. We’re happy to
              help with account questions, file issues, licensing doubts and
              seller onboarding.
            </p>

            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4 mb-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                For urgent payment issues
              </h2>
              <p className="text-sm text-slate-700 mb-2">
                If your question is related to a purchase, please include:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>Razorpay payment ID</li>
                <li>Buyer email address used at checkout</li>
                <li>Purchased file name or order reference</li>
              </ul>
              <p className="text-xs text-slate-500 mt-3">
                Support hours: <span className="font-semibold">
                  Monday – Friday, 10:00 – 18:00 IST
                </span>
                . Requests submitted outside these hours will be processed on
                the next working day.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 text-slate-50 px-5 py-4 text-sm">
              <p className="font-semibold mb-1">Security & account safety</p>
              <p>
                Picsellart will never ask for your password or OTP in email or
                chat. If you receive any suspicious message claiming to be from
                Picsellart, please forward it to our support team.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                  placeholder="Question or feedback"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-1 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md hover:shadow-lg transition-shadow"
              >
                Send message
              </button>

              <p className="text-xs text-slate-500 mt-2">
                By submitting this form, you agree that we may use the
                information you provide to respond to your enquiry and improve
                our services.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
