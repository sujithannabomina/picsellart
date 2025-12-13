import React, { useMemo, useState } from "react";

function Field({ label, required, children, hint }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-800">
          {label} {required ? <span className="text-rose-600">*</span> : null}
        </label>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export default function Contact() {
  const supportHours = useMemo(
    () => "Monday – Friday, 10:00 – 18:00 IST",
    []
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "idle", msg: "" });

  const onChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    // Simple email check (good enough for UI)
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return "Please enter a valid email.";
    if (!form.subject.trim()) return "Please enter a subject.";
    if (!form.message.trim()) return "Please enter your message.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();

    const err = validate();
    if (err) {
      setStatus({ type: "error", msg: err });
      return;
    }

    // Production-safe fallback: opens the user's email client.
    // (No backend required; won’t break deployment.)
    const to = "support@picsellart.com"; // change if you want
    const subj = encodeURIComponent(`[Picsellart] ${form.subject}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n\n---\nIf this is about a payment, please include Razorpay Payment ID / Order ID and the purchased file name.`
    );

    window.location.href = `mailto:${to}?subject=${subj}&body=${body}`;

    setStatus({
      type: "success",
      msg: "Thanks! Your email app will open now. If it doesn’t, please copy the details and email us.",
    });
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-3xl border border-white/60 bg-white/50 backdrop-blur-md shadow-sm p-6 sm:p-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Contact Us
            </h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Send us a message — we typically reply within{" "}
              <span className="font-semibold text-slate-900">24–48 hours</span>.
              We can help with account questions, licensing doubts, file issues,
              and seller onboarding.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Info cards */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="font-semibold text-slate-900">
                  Urgent payment / purchase issues
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  To help us locate your order faster, include:
                </p>
                <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
                  <li>Razorpay payment ID / reference</li>
                  <li>Buyer email used at checkout</li>
                  <li>Purchased file name / order reference</li>
                </ul>
                <div className="mt-4 text-xs text-slate-500">
                  Support hours: <span className="font-semibold">{supportHours}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="font-semibold text-slate-900">
                  Security & account safety
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Picsellart will never ask for your password or OTP over email or chat.
                  If you receive suspicious messages claiming to be from Picsellart,
                  do not share credentials.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="font-semibold text-slate-900">Refund timeline</div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Refunds (if approved) typically take{" "}
                  <span className="font-semibold text-slate-900">1–2 business days</span>{" "}
                  for review plus{" "}
                  <span className="font-semibold text-slate-900">3–7 business days</span>{" "}
                  for Razorpay/bank processing.
                </p>
                <a
                  href="/refunds"
                  className="mt-4 inline-flex text-sm font-semibold text-violet-700 hover:underline"
                >
                  View refund policy →
                </a>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      Send us a message
                    </div>
                    <div className="text-sm text-slate-600">
                      We’ll respond as soon as possible.
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Required fields are marked with <span className="text-rose-600">*</span>
                  </div>
                </div>

                {status.type !== "idle" ? (
                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 text-sm border ${
                      status.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {status.msg}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Your name" required>
                      <input
                        value={form.name}
                        onChange={onChange("name")}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300"
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                    </Field>

                    <Field label="Email" required>
                      <input
                        value={form.email}
                        onChange={onChange("email")}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300"
                        placeholder="you@email.com"
                        autoComplete="email"
                      />
                    </Field>
                  </div>

                  <Field label="Subject" required hint="Example: Order issue / Licensing / Account">
                    <input
                      value={form.subject}
                      onChange={onChange("subject")}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300"
                      placeholder="What can we help you with?"
                    />
                  </Field>

                  <Field label="Message" required>
                    <textarea
                      value={form.message}
                      onChange={onChange("message")}
                      className="w-full min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-300"
                      placeholder="Tell us the issue in detail (include Razorpay Payment ID / Order ID if relevant)."
                    />
                  </Field>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      By submitting, you agree that we may use the information you
                      provide to respond to your enquiry and improve our services.
                    </p>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-sm hover:opacity-95"
                    >
                      Send message
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-xs text-slate-500">
                  Tip: If your email app doesn’t open, copy your message and email{" "}
                  <span className="font-semibold">support@picsellart.com</span>.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* small footer spacing */}
        <div className="h-10" />
      </div>
    </div>
  );
}
