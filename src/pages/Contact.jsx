// src/pages/Contact.jsx
import React, { useState } from "react";

const SUPPORT_HOURS = "Monday – Friday, 10:00 – 18:00 IST";
const RESPONSE_TIME = "24–48 hours";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState({ type: "idle", msg: "" });

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function onSubmit(e) {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !subject || !message) {
      setStatus({ type: "error", msg: "Please fill all required fields." });
      return;
    }
    if (!validateEmail(email)) {
      setStatus({ type: "error", msg: "Please enter a valid email address." });
      return;
    }

    // No backend yet: use mailto so it still works in production.
    // Replace support@picsellart.com with your real support email later.
    const to = "support@picsellart.com";
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${to}?subject=${encodeURIComponent(
      `[Picsellart] ${subject}`
    )}&body=${encodeURIComponent(body)}`;

    setStatus({ type: "success", msg: "Opening your email app to send the message…" });
    window.location.href = mailto;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Contact Us
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Send us a message — we typically reply within <span className="font-semibold">{RESPONSE_TIME}</span>.
                We can help with account questions, file issues, licensing doubts, and seller onboarding.
              </p>
            </div>

            <a
              href="/refunds"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 md:w-auto"
            >
              View refund policy →
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* LEFT: info cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Urgent payment / purchase issues</div>
                <p className="mt-2 text-sm text-slate-600">
                  To help us locate your order faster, include:
                </p>
                <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  <li>Razorpay payment ID / reference</li>
                  <li>Buyer email used at checkout</li>
                  <li>Purchased file name / order reference</li>
                </ul>
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Support hours</div>
                  <div className="mt-1">{SUPPORT_HOURS}</div>
                  <div className="mt-2 text-slate-600">
                    Requests outside hours are processed on the next working day.
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Security & account safety</div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  Picsellart will never ask for your password or OTP over email or chat.
                  If you receive suspicious messages claiming to be from Picsellart, do not share credentials.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Refund timeline</div>
                <p className="mt-2 text-sm text-slate-700">
                  If approved, refunds typically take{" "}
                  <span className="font-semibold">1–2 business days</span> for review +
                  <span className="font-semibold"> 3–7 business days</span> for Razorpay/bank processing.
                </p>
              </div>
            </div>

            {/* RIGHT: form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-bold text-slate-900">Send us a message</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Required fields are marked with <span className="font-semibold">*</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-xs text-slate-500">
                    Tip: include order details for faster help
                  </div>
                </div>

                {status.type !== "idle" && (
                  <div
                    className={
                      "mt-4 rounded-xl px-4 py-3 text-sm " +
                      (status.type === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border border-rose-200 bg-rose-50 text-rose-800")
                    }
                  >
                    {status.msg}
                  </div>
                )}

                <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
                  <div className="sm:col-span-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Your name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Your full name"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:shadow"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="you@email.com"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:shadow"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={onChange}
                      placeholder="Order issue / Licensing / Account / Seller onboarding"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:shadow"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      rows={6}
                      placeholder="Tell us the issue in detail. If relevant, include order ID / payment reference / file name."
                      className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:shadow"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      By submitting, you agree that we may use the information you provide to respond to your enquiry and improve our services.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    >
                      Send message →
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-xs text-slate-500">
                  Note: This form opens your email app (mailto) until a server/email API is connected.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
