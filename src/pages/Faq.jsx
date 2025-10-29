import React from "react";

const QA = ({ q, children }) => (
  <details className="faq-item" open={false}>
    <summary className="faq-q">{q}</summary>
    <div className="faq-a">{children}</div>
  </details>
);

export default function Faq() {
  return (
    <div className="container">
      <h1>Frequently Asked Questions</h1>

      <QA q="What is Picsellart?">
        Picsellart is a marketplace where creators sell photos and visuals.
        Buyers get instant, verified downloads; sellers get secure payments and
        simple tools to list and manage images.
      </QA>

      <QA q="Who can sell on Picsellart?">
        Anyone who owns the rights to their visuals can apply as a seller.
        You’ll sign in with Google, choose a plan, and start uploading. You must
        own (or have a license for) everything you list.
      </QA>

      <QA q="How does pricing work?">
        Sellers set their own prices per image. Picsellart shows prices in INR.
        Taxes and gateway fees are handled automatically at checkout.
      </QA>

      <QA q="How are images delivered to buyers?">
        After successful payment, buyers receive a secure, time-limited download
        link to the original, un-watermarked file. Thumbnails and previews on
        the site are watermarked to discourage misuse.
      </QA>

      <QA q="What file types and sizes are supported?">
        High-resolution JPG/PNG are recommended. For now, each file should be
        below 25 MB. (Larger limits and RAW support are planned.)
      </QA>

      <QA q="How do refunds work?">
        Digital items are typically non-refundable once downloaded. If there’s a
        payment issue or file problem (corrupt or wrong file), contact us within
        48 hours via the Contact page. We investigate quickly and resolve
        case-by-case.
      </QA>

      <QA q="What about licensing and usage rights?">
        By default, a standard license grants buyers the right to use the
        download in personal or commercial projects (non-exclusive, no
        redistribution/resale of the file itself). For special uses (e.g., large
        print runs, merchandise), contact the seller or Picsellart support to
        arrange an extended license.
      </QA>

      {/* Lightweight styles for this page */}
      <style>{`
        .faq-item { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 16px; margin: 12px 0; background:#fff; }
        .faq-q { cursor: pointer; font-weight: 600; }
        .faq-a { margin-top: 10px; color: #334155; line-height: 1.6; }
      `}</style>
    </div>
  );
}
