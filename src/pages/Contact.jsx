import React, { useMemo, useState } from "react";

const styles = {
  page: { maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
    gap: 18,
    alignItems: "start"
  },
  card: {
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.12)"
  },
  cardPad: { padding: 18 },
  h1: { fontSize: "2rem", fontWeight: 800, margin: 0 },
  sub: { marginTop: 8, color: "#4b5563", lineHeight: 1.65, maxWidth: 820 },
  small: { color: "#64748b", fontSize: "0.92rem", lineHeight: 1.6 },

  label: { display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    background: "white"
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    background: "white",
    minHeight: 120,
    resize: "vertical"
  },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "grid", gap: 6, marginTop: 12 },

  btnRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 },
  btnPrimary: {
    border: "none",
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
    color: "white",
    background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
    boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)"
  },
  btnGhost: {
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
    background: "white",
    border: "1px solid #e5e7eb",
    color: "#0f172a"
  },
  alert: {
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(239,246,255,0.6)",
    color: "#0f172a",
    lineHeight: 1.6
  },

  sideTitle: { fontSize: "1.05rem", fontWeight: 800, margin: "0 0 6px", color: "#0f172a" },
  ul: { margin: 0, paddingLeft: "1.2rem", color: "#334155", lineHeight: 1.7 },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.8)",
    color: "#0f172a",
    fontWeight: 700,
    fontSize: "0.9rem"
  },
  link: { color: "#4f46e5", textDecoration: "underline" }
};

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // 'ok' | 'error'

  const isEmailValid = useMemo(() => {
    const v = email.trim();
    if (!v) return true; // only validate if typed
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [email]);

  const canSubmit = name.trim() && email.trim() && isEmailValid && subject.trim() && message.trim();

  function onSubmit(e) {
    e.preventDefault();

    // This is UI-only. Hook this to your backend/email service later.
    if (!canSubmit) {
      setStatus("error");
      return;
    }

    setStatus("ok");

    // optional: clear after success
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <main className="page page-contact">
      <section style={styles.page}>
        <h1 style={styles.h1}>Contact Us</h1>
        <p style={styles.sub}>
          Send us a message — we typically reply within <b>24–48 hours</b>. We can help with account
          questions, file issues, licensing doubts, and seller onboarding.
        </p>

        <div style={{ marginTop: 16, ...styles.grid }}>
          {/* LEFT: FORM */}
          <div style={styles.card}>
            <div style={styles.cardPad}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={styles.pill}>Support</div>
                <div style={styles.small}>
                  Support hours: <b>Mon–Fri</b>, 10:00–18:00 IST
                </div>
              </div>

              <form onSubmit={onSubmit} style={{ marginTop: 10 }}>
                <div style={styles.row2}>
                  <div style={styles.field}>
                    <label style={styles.label}>Your name *</label>
                    <input
                      style={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Email *</label>
                    <input
                      style={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                    {!isEmailValid && (
                      <div style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                        Please enter a valid email.
                      </div>
                    )}
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Subject *</label>
                  <input
                    style={styles.input}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Order issue / Licensing / Account / Seller onboarding"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Message *</label>
                  <textarea
                    style={styles.textarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what happened. If this is about a purchase, include your Razorpay payment ID/reference, buyer email used at checkout, and the file name."
                  />
                </div>

                <div style={styles.btnRow}>
                  <button type="submit" style={styles.btnPrimary} disabled={!canSubmit}>
                    Send message
                  </button>
                  <a href="/refunds" style={{ ...styles.btnGhost, display: "inline-flex", alignItems: "center" }}>
                    View refund policy →
                  </a>
                </div>

                {status === "ok" && (
                  <div style={styles.alert}>
                    ✅ Message saved (UI). Connect this form to your email/back-end later. For payment issues,
                    include the details from the right panel for faster support.
                  </div>
                )}
                {status === "error" && (
                  <div style={{ ...styles.alert, background: "rgba(254,226,226,0.6)" }}>
                    ❗ Please fill all required fields correctly before submitting.
                  </div>
                )}

                <p style={{ ...styles.small, marginTop: 10 }}>
                  By submitting this form, you agree that we may use the information you provide to respond to your
                  enquiry and improve our services.
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div style={{ display: "grid", gap: 14 }}>
            <div style={styles.card}>
              <div style={styles.cardPad}>
                <p style={styles.sideTitle}>For urgent payment / purchase issues</p>
                <p style={styles.small}>
                  Include these details so we can locate your order faster:
                </p>
                <ul style={styles.ul}>
                  <li>Razorpay payment ID / reference</li>
                  <li>Buyer email used at checkout</li>
                  <li>Purchased file name / order reference</li>
                </ul>
                <div style={{ marginTop: 12, ...styles.alert }}>
                  Refund timeline (if approved): <b>1–2 business days</b> review + <b>3–7 business days</b>{" "}
                  Razorpay/bank processing. See{" "}
                  <a href="/refunds" style={styles.link}>
                    Refunds & Cancellations
                  </a>
                  .
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.cardPad}>
                <p style={styles.sideTitle}>Security & account safety</p>
                <p style={styles.small}>
                  Picsellart will never ask for your password or OTP over email or chat. If you receive suspicious
                  messages claiming to be from Picsellart, do not share credentials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive fallback */}
        <style>{`
          @media (max-width: 980px) {
            .page-contact section > div[style*="grid-template-columns"] { 
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </main>
  );
}
