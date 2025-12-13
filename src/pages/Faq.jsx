import React, { useMemo, useState } from "react";

const FAQS = [
  {
    q: "What is Picsellart?",
    a: "Picsellart is a curated marketplace where photographers and creators sell high-quality digital images to designers, agencies, brands, and individual buyers."
  },
  {
    q: "How do I become a seller?",
    a: "Choose a seller plan, complete the payment, then sign in to your seller account. After onboarding/verification (if applicable), you can upload within your plan limits and start selling."
  },
  {
    q: "How are images delivered to buyers?",
    a: "After a successful payment, buyers get instant access to a clean, full-resolution download. Public previews remain watermarked for protection."
  },
  {
    q: "Do images have watermarks?",
    a: "Yes—Explore page previews include a Picsellart watermark. Purchased downloads are watermark-free."
  },
  {
    q: "What is your refund policy?",
    a: "Because these are instant digital downloads, refunds are not offered for change-of-mind. Refunds are considered only if the delivered file is corrupt, incomplete, inaccessible, or clearly does not match the listing description."
  },
  {
    q: "What is the refund timeline?",
    a: "If approved: 1–2 business days for our review/approval, then 3–7 business days for Razorpay/bank processing to reflect the reversal (may vary by bank holidays/weekends)."
  },
  {
    q: "Can I use purchased images commercially?",
    a: "Yes—unless the listing states otherwise, downloads include a standard commercial license for design, marketing, social media, and client work. Reselling or redistributing the raw files is not allowed."
  }
];

const styles = {
  page: { maxWidth: 980, margin: "0 auto", padding: "28px 16px 64px" },
  header: { marginBottom: 16 },
  h1: { fontSize: "2rem", fontWeight: 800, margin: 0 },
  sub: { marginTop: 8, color: "#4b5563", lineHeight: 1.6, maxWidth: 780 },
  searchRow: { display: "flex", gap: 10, alignItems: "center", marginTop: 18, maxWidth: 560 },
  search: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    outline: "none",
    background: "rgba(255,255,255,0.9)"
  },
  list: { marginTop: 18, display: "grid", gap: 12 },
  item: {
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 14px 32px rgba(15,23,42,0.10)",
    overflow: "hidden"
  },
  btn: {
    width: "100%",
    textAlign: "left",
    padding: "14px 14px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  q: { fontSize: "1rem", fontWeight: 700, margin: 0, color: "#0f172a" },
  chevron: (open) => ({
    width: 34,
    height: 34,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(148,163,184,0.30)",
    background: "rgba(255,255,255,0.9)",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 180ms ease"
  }),
  aWrap: { padding: "0 14px 14px" },
  a: { margin: 0, color: "#334155", lineHeight: 1.7 },
  footer: {
    marginTop: 18,
    color: "#4b5563",
    lineHeight: 1.7
  },
  link: { color: "#4f46e5", textDecoration: "underline" }
};

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Faq() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((x) => (x.q + " " + x.a).toLowerCase().includes(q));
  }, [query]);

  // Keep openIndex valid when filtering
  const safeOpenIndex = Math.min(openIndex, Math.max(filtered.length - 1, 0));

  return (
    <main className="page page-faq">
      <section style={styles.page}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Frequently Asked Questions</h1>
          <p style={styles.sub}>
            Quick answers about buying and selling on Picsellart. If you can’t find what you need,
            use the Contact page and we’ll help you.
          </p>

          <div style={styles.searchRow}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search: refunds, watermark, seller…'
              style={styles.search}
              aria-label="Search FAQs"
            />
          </div>
        </header>

        <div style={styles.list}>
          {filtered.length === 0 ? (
            <div style={{ ...styles.item, padding: 16, color: "#334155" }}>
              No FAQs found for “{query}”.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isOpen = idx === safeOpenIndex;
              return (
                <div key={item.q} style={styles.item}>
                  <button
                    type="button"
                    style={styles.btn}
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <p style={styles.q}>{item.q}</p>
                    <span style={styles.chevron(isOpen)}>
                      <ChevronIcon />
                    </span>
                  </button>

                  {isOpen && (
                    <div style={styles.aWrap}>
                      <p style={styles.a}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <p style={styles.footer}>
          Still have questions? Visit the{" "}
          <a href="/contact" style={styles.link}>
            Contact page
          </a>{" "}
          and our team typically replies within 24–48 hours.
        </p>
      </section>
    </main>
  );
}
