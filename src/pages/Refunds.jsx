// src/pages/Refunds.jsx
const Refunds = () => {
  return (
    <main className="page-shell">
      <section className="page-header-block">
        <h1 className="page-title">Refunds &amp; Cancellations</h1>
        <p className="page-subtitle">
          Picsellart provides instant digital downloads. Please review this
          policy carefully before purchasing.
        </p>
      </section>

      <section className="page-card">
        <h2 className="section-heading">Eligibility</h2>
        <ul className="bulleted">
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

        <h2 className="section-heading">How to request help</h2>
        <ol className="numbered">
          <li>Provide your order ID and the affected file name.</li>
          <li>
            Explain the issue clearly and attach screenshots if possible.
          </li>
          <li>
            Contact us using the form on the <a href="/contact">Contact</a> page.
          </li>
        </ol>

        <h2 className="section-heading">Abuse &amp; fraud</h2>
        <p>
          We monitor suspicious activity across accounts. Repeated refund abuse,
          chargebacks, or file sharing may result in account suspension and
          removal from the marketplace.
        </p>
      </section>
    </main>
  );
};

export default Refunds;
