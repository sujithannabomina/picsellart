import React from "react";

export default function Refunds() {
  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="page-title">Refunds &amp; Cancellations</h1>
        <p className="page-subtitle">
          Picsellart provides instant digital downloads. Please review this
          policy carefully before purchasing.
        </p>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}>
            Eligibility
          </h2>
          <ul className="refunds-list">
            <li>
              Refunds are <span className="text-strong">not offered</span> for
              change-of-mind or “I don’t need this file anymore.”
            </li>
            <li>
              If the delivered file is corrupt, incomplete, or does not match
              the listing description, you may request a replacement or refund.
            </li>
            <li>
              We may replace the file, issue store credit, or refund at our
              discretion after verifying the issue.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}>
            How to request help
          </h2>
          <ol className="refunds-list">
            <li>Provide your order ID and the affected file name.</li>
            <li>
              Explain the issue clearly and attach screenshots if possible.
            </li>
            <li>Contact us via the form on the Contact page.</li>
          </ol>
        </section>

        <section>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}>
            Abuse &amp; fraud
          </h2>
          <p style={{ fontSize: "0.94rem", color: "#475569" }}>
            We monitor suspicious activity across accounts. Repeated refund
            abuse, chargebacks, or file sharing may result in account
            suspension.
          </p>
        </section>

        <p
          style={{
            marginTop: 24,
            fontSize: "0.88rem",
            color: "#94a3b8",
          }}
        >
          Questions about this policy?{" "}
          <a href="/contact" style={{ textDecoration: "underline" }}>
            Contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
