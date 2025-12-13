// src/pages/Contact.jsx
import React, { useState } from "react";

function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now we just show a friendly confirmation.
    // Later you can connect this to email / backend.
    alert("Thank you! Your message has been recorded.");
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 via-slate-50/60 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* Left: info / copy */}
          <section>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Contact Us
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
              Send us a message — our support team typically replies within{" "}
              <span className="font-semibold">24–48 hours</span>. We&apos;re
              happy to help with account questions, file issues, licensing
              doubts, and seller onboarding.
            </p>

            <div className="mt-8 space-y-6 text-sm sm:text-base text-slate-700">
              <div>
                <h2 className="font-semibold text-slate-900">
                  For urgent payment issues
                </h2>
                <p className="mt-1">
                  If your question is related to a purchase, please include:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Razorpay payment ID</li>
                  <li>Buyer email address used at checkout</li>
                  <li>Purchased file name or order reference</li>
                </ul>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  Support hours: <span className="font-medium">
                    Monday – Friday, 10:00 – 18:00 IST
                  </span>
                  . Requests submitted outside these hours are processed on the
                  next working day.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Security &amp; account safety
                </h2>
                <p className="mt-1 text-sm sm:text-base">
                  Picsellart will never ask for your password or OTP in email or
                  chat. If you receive any suspicious message claiming to be
                  from Picsellart, please forward it to our support team.
                </p>
              </div>
            </div>
          </section>

          {/* Right: contact form card */}
          <section className="bg-white/90 border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/70 px-5 sm:px-7 py-6 sm:py-7">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
                >
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="Question or feedback"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-1 w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-violet-400/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 focus:ring-offset-slate-50 transition"
              >
                Send message
              </button>

              <p className="mt-2 text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                By submitting this form, you agree that we may use the
                information you provide to respond to your enquiry and improve
                our services.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Contact;
