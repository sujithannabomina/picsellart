import React from "react";

const styles = {
  page: { maxWidth: 980, margin: "0 auto", padding: "28px 16px 64px" },
  h1: { fontSize: "2rem", fontWeight: 800, margin: 0 },
  sub: { marginTop: 10, color: "#4b5563", lineHeight: 1.65, maxWidth: 860 },
  meta: { marginTop: 10, color: "#64748b", fontSize: "0.92rem" },

  card: {
    marginTop: 18,
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.10)"
  },
  pad: { padding: 18 },

  sectionTitle: { fontSize: "1.1rem", fontWeight: 800, margin: "0 0 8px", color: "#0f172a" },
  p: { margin: 0, color: "#334155", lineHeight: 1.7 },
  ul: { margin: "10px 0 0", paddingLeft: "1.2rem", color: "#334155", lineHeight: 1.75 },

  timelineWrap: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12
  },
  tile: {
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(239,246,255,0.55)",
    padding: 14
  },
  tileTitle: { margin: 0, fontWeight: 800, color: "#0f172a" },
  tileSub: { margin: "6px 0 0", color: "#334155", lineHeight: 1.7 },
  note: { marginTop: 10, color: "#64748b", lineHeight: 1.6, fontSize: "0.92rem" },

  callout: {
    marginTop: 14,
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.85)",
    color: "#0f172a",
    lineHeight: 1.7
  },
  link: { color: "#4f46e5", textDecoration: "underline" }
};

export default function Refunds() {
  const updated = "13 December 2025";

  return (
    <main className="page page-refunds">
      <section style={styles.page}>
        <h1 style={styles.h1}>Refunds & Cancellations</h1>
        <p style={styles.sub}>
          Picsellart provides instant digital downloads. Because digital files can’t be “returned” once accessed,
          refund eligibility is limited. Please review this policy carefully before purchasing.
        </p>
        <div style={styles.meta}>Last updated: {updated}</div>

        <div style={styles.card}>
          <div style={styles.pad}>
            <p style={styles.sectionTitle}>At a glance</p>
            <ul style={styles.ul}>
              <li><b>No refunds</b> for change-of-mind (“I don’t need this anymore”).</li>
              <li>
                Refunds considered only for <b>file issues</b>: corrupt, incomplete, inaccessible, or clearly does not
                match the listing description.
              </li>
              <li>
                Typical timeline (if approved): <b>1–2 business days</b> review + <b>3–7 business days</b> Razorpay/bank
                processing.
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.pad}>
            <p style={styles.sectionTitle}>Refund eligibility</p>
            <p style={styles.p}>
              Refund requests are reviewed case-by-case. We may approve a replacement or a refund only after verifying
              the issue and confirming purchase details.
            </p>
            <ul style={styles.ul}>
              <li>Refunds are not offered for change-of-mind or accidental purchases.</li>
              <li>
                If the delivered file is <b>corrupt</b>, <b>incomplete</b>, <b>inaccessible</b>, or <b>does not match</b>{" "}
                the listing description, you may request a replacement or refund.
              </li>
              <li>
                We may request additional information (order ID, payment reference, screenshots) to verify the issue.
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.pad}>
            <p style={styles.sectionTitle}>Refund processing timelines</p>
            <p style={styles.p}>
              Once your request is approved, refunds are typically processed within the following timelines:
            </p>

            <div style={styles.timelineWrap}>
              <div style={styles.tile}>
                <p style={styles.tileTitle}>Picsellart review</p>
                <p style={styles.tileSub}>
                  <b>1–2 business days</b> to verify the issue and approve the refund or replacement.
                </p>
              </div>

              <div style={styles.tile}>
                <p style={styles.tileTitle}>Razorpay / bank processing</p>
                <p style={styles.tileSub}>
                  <b>3–7 business days</b> for Razorpay or your bank to complete the reversal and reflect it in your account.
                </p>
              </div>
            </div>

            <div style={styles.note}>
              Note: Weekends, bank holidays, or additional verification by your bank may extend these timelines slightly.
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.pad}>
            <p style={styles.sectionTitle}>How to request support</p>
            <ul style={styles.ul}>
              <li>Provide your order ID / Razorpay payment ID and the file name.</li>
              <li>Describe the problem clearly (e.g., “file not downloading”, “file corrupted”, “wrong file”).</li>
              <li>Attach screenshots or error messages if possible.</li>
              <li>
                Submit your request using the form on the{" "}
                <a href="/contact" style={styles.link}>
                  Contact page
                </a>
                .
              </li>
            </ul>

            <div style={styles.callout}>
              <b>Important:</b> By making a purchase on Picsellart, you agree to this Refunds & Cancellations policy in
              addition to our general Terms and any license-specific conditions mentioned on individual listings.
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .page-refunds section div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </main>
  );
}
