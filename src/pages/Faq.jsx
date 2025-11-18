// src/pages/Faq.jsx
import React from "react";

export default function Faq() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Frequently Asked Questions</h1>
      <p className="page-subtitle">
        Answers to common questions about buying and selling on Picsellart.
      </p>

      <div className="card">
        <h2>What is Picsellart?</h2>
        <p>
          Picsellart is a curated marketplace where photographers and creators
          sell high-quality digital images to designers, agencies and brands.
        </p>
      </div>

      <div className="card">
        <h2>How do I become a seller?</h2>
        <p>
          Choose a seller plan, sign in with Google and upload your approved
          images. You set your own price within the plan limits.
        </p>
      </div>

      <div className="card">
        <h2>How are images delivered to buyers?</h2>
        <p>
          After successful Razorpay payment, buyers receive instant access to a
          clean, watermark-free download from their dashboard.
        </p>
      </div>

      <div className="card">
        <h2>Do images have watermarks?</h2>
        <p>
          Public previews on Explore and View are watermarked. Purchased
          downloads are full-resolution and watermark-free.
        </p>
      </div>

      <div className="card">
        <h2>What is your refund policy?</h2>
        <p>
          Because files are instantly downloadable, refunds are only offered
          when a file is corrupt, incomplete or does not match the listing
          description.
        </p>
      </div>

      <div className="card">
        <h2>Can I use images commercially?</h2>
        <p>
          Yes, unless a listing clearly says otherwise. Each file includes a
          standard commercial license. Reselling or redistributing the raw files
          is not allowed.
        </p>
      </div>
    </div>
  );
}
