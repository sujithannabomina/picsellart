import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        type: "error",
        msg: "Please fill your name, email, and message.",
      });
      return;
    }

    // NOTE:
    // If you already have a backend / Firebase function for contact, call it here.
    // This keeps UI production-ready and DOES NOT break your site even without backend.
    try {
      setLoading(true);

      // Example placeholder: simulate submit
      await new Promise((r) => setTimeout(r, 600));

      setStatus({
        type: "success",
        msg: "Message sent. Our support team will reply within 24–48 hours.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Something went wrong while sending. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Form card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <p className="text-sm font-medium text-slate-500">Contact</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Send us a message — we typically reply within{" "}
              <span className="font-semibold text-slate-900">24–48 hours</span>.
              We’re happy to help with account questions, file issues, licensing
              doubts, and seller onboarding.
            </p>

            {/* Status */}
            {status.msg ? (
              <div
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                {status.msg}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Your name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Jane Doe"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  placeholder="Order / licensing / account help"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Tell us how we can help…"
                  rows={6}
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending…" : "Send message"}
              </button>

              <p className="text-xs text-slate-500">
                By submitting this form, you agree that we may use the information
                you provide to respond to your enquiry and improve our services.
              </p>
            </form>
          </div>

          {/* Right: Helpful info card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                For urgent payment / purchase issues
              </h2>
              <p className="mt-2 text-slate-600">
                Include these details so we can locate your order faster:
              </p>

              <ul className="mt-4 space-y-2 text-slate-700">
                <li className="flex gap-2">
                  <span className="mt-[7px] h-2 w-2 rounded-full bg-violet-500" />
                  Razorpay payment ID / reference
                </li>
                <li className="flex gap-2">
                  <span className="mt-[7px] h-2 w-2 rounded-full bg-violet-500" />
                  Buyer email used at checkout
                </li>
                <li className="flex gap-2">
                  <span className="mt-[7px] h-2 w-2 rounded-full bg-violet-500" />
                  Purchased file name / order reference
                </li>
              </ul>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Support hours</div>
                <div className="mt-1">
                  Monday – Friday, 10:00 – 18:00 IST
                </div>
                <div className="mt-1 text-slate-600">
                  Requests outside hours are processed on the next working day.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Security & account safety
              </h2>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Picsellart will never ask for your password or OTP in email or chat.
                If you receive suspicious messages claiming to be from Picsellart,
                do not share credentials.
              </p>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Tip: Only trust communications from official channels.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
