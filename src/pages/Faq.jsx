import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "What is Picsellart?",
    a: "Picsellart is a curated marketplace where photographers and creators sell high-quality digital images to designers, agencies, and brands.",
  },
  {
    q: "How do I become a seller?",
    a: "Sign in through Seller Login with your Google account, choose a plan, and upload your approved images within your plan limits.",
  },
  {
    q: "How are images delivered to buyers?",
    a: "After successful payment, buyers receive an instant download link on the site and a secure download link over email.",
  },
  {
    q: "Do images have watermarks?",
    a: "Preview images in Explore are watermarked. Purchased downloads are delivered without the visible watermark.",
  },
  {
    q: "What is your refund policy?",
    a: "Because files are digital downloads, refunds are only considered for corrupted or non-matching files. See the Refunds page for full details.",
  },
  {
    q: "Can I use images commercially?",
    a: "Yes, unless a listing explicitly states otherwise. Each purchase includes a standard commercial license for one brand.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="page-title">Frequently Asked Questions</h1>
        <p className="page-subtitle">
          Answers to common questions about buying and selling on Picsellart.
        </p>

        <div className="faq-accordion">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <div
                key={item.q}
                className="faq-item"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span style={{ fontSize: "1.1rem", color: "#9ca3af" }}>
                    {isOpen ? "–" : "+"}
                  </span>
                </div>
                {isOpen && <div className="faq-answer">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
