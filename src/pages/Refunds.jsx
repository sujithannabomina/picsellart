// src/pages/Refunds.jsx
import Header from "../components/Header";

const Section = ({ title, children }) => (
  <section style={{ marginTop: 20 }}>
    <h2 style={{ fontSize: 22, marginBottom: 8 }}>{title}</h2>
    <div style={{ color: "#374151", lineHeight: 1.7 }}>{children}</div>
  </section>
);

export default function Refunds() {
  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Refunds & Returns Policy</h1>
        <p style={{ color: "#6b7280" }}>
          This policy explains when refunds are issued for purchases made on Picsellart and how to request one.
          Please read it carefully before buying any digital file.
        </p>

        <Section title="What Purchases Are Eligible for a Refund?">
          <ul style={{ paddingLeft: 18 }}>
            <li><b>Corrupted or Unusable Files:</b> The delivered file is damaged, incomplete, or fails to open in standard software.</li>
            <li><b>File Not as Described:</b> The actual content materially differs from the listing description or preview.</li>
            <li><b>Duplicate Purchases:</b> The same file was purchased more than once by mistake.</li>
          </ul>
          <p style={{ marginTop: 8 }}>
            For <b>digital downloads</b>, we generally cannot issue refunds after a successful download unless
            one of the cases above applies.
          </p>
        </Section>

        <Section title="What Is Not Eligible?">
          <ul style={{ paddingLeft: 18 }}>
            <li>Change of mind after downloading.</li>
            <li>Incorrect expectations not supported by the listing text or previews.</li>
            <li>Commercial misuse or policy violations.</li>
            <li>Requests filed more than <b>7 days</b> after purchase, unless required by law.</li>
          </ul>
        </Section>

        <Section title="How to Request a Refund">
          <ol style={{ paddingLeft: 18 }}>
            <li>Open the <a href="/contact">Contact</a> page.</li>
            <li>Include your <b>Order ID</b>, file name, purchase date, and a short description of the issue.</li>
            <li>Attach a screenshot or error message if the file is corrupted or unusable.</li>
          </ol>
          <p style={{ marginTop: 8 }}>
            Our support team typically responds within <b>24–48 hours</b>. If approved, your refund is processed
            to the original payment method. We may revoke access to the file after a refund.
          </p>
        </Section>

        <Section title="Partial Refunds & Replacements">
          <p>
            In some cases, we may offer a replacement download link or a partial refund—for example, if only part
            of a multi-file pack is affected. We’ll clarify the best resolution after reviewing your request.
          </p>
        </Section>

        <Section title="Fraud & Abuse">
          <p>
            If we detect abuse (serial refunding, reselling, or unauthorized redistribution), we may decline the
            request and limit account access as permitted by our Terms.
          </p>
        </Section>

        <Section title="Need Help?">
          <p>
            We want you to be happy with your purchase. If you’re unsure whether a file meets your use-case, please
            message us via <a href="/contact">Contact</a> before buying—we’ll guide you.
          </p>
        </Section>
      </div>
    </>
  );
}
