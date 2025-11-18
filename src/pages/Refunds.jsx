// src/pages/Refunds.jsx
import React from "react";

export default function Refunds() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Refunds &amp; Cancellations</h1>
      <p className="page-subtitle">
        Picsellart provides instant digital downloads. Please review this policy
        carefully before purchasing.
      </p>

      <div className="card">
        <h2>Eligibility</h2>
        <ul style={{ paddingLeft: "18px", marginTop: 8 }}>
          <li>
            Refunds are not offered for change-of-mind or “I don’t need this
            file anymore.”
          </li>
          <li>
            If the delivered file is corrupt, incomplete, or does not match the
            listing description, you may request a replacement or refund.
          </li>
          <li>
            We may replace the file, issue store credit, or refund at our
            discretion after verifying the issue.
          </li>
        </ul>
      </div>

      <div className="card">
        <h2>How to request help</h2>
        <ol style={{ paddingLeft: "18px", marginTop: 8 }}>
          <li>Provide your order ID and the affected file name.</li>
          <li>Explain the issue clearly and attach screenshots if possible.</li>
          <li>Contact us using the form on the Contact page.</li>
        </ol>
      </div>

      <div className="card">
        <h2>Abuse &amp; fraud</h2>
        <p>
          We monitor suspicious activity across accounts. Repeated refund abuse,
          chargebacks, or file sharing may result in account suspension and
          removal from the marketplace.
        </p>
      </div>
    </div>
  );
}
