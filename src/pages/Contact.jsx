// src/pages/Contact.jsx
import React from "react";

export default function Contact() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Contact Us</h1>
      <p className="page-subtitle">
        Send a message – our small team typically replies within 24–48 hours.
      </p>

      <div className="card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you. This demo form does not send emails yet.");
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Your name
            </label>
            <input
              type="text"
              defaultValue="Jane Doe"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.8)",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              defaultValue="you@example.com"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.8)",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Subject
            </label>
            <input
              type="text"
              defaultValue="Question or feedback"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.8)",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Tell us how we can help…"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.8)",
                fontSize: 14,
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(135deg, #7c3aed, #ec4899)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Send message
          </button>
        </form>
      </div>

      <div className="card">
        <h2>For urgent payment issues</h2>
        <p style={{ marginBottom: 6 }}>
          Include your Razorpay payment ID, buyer email address and the file
          name you purchased. This helps us locate your order quickly.
        </p>
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          Support hours: Monday – Friday, 10:00 – 18:00 IST.
        </p>
      </div>
    </div>
  );
}
