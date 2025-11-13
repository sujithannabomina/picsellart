import React from "react";

export default function Contact() {
  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">
          Send a message – our small team typically replies within 24–48 hours.
        </p>

        <div className="form-grid" style={{ maxWidth: 540 }}>
          <div className="form-field">
            <label htmlFor="name">Your Name</label>
            <input id="name" type="text" placeholder="Jane Doe" />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" type="text" placeholder="Question or feedback" />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us how we can help…"
            />
          </div>

          <div>
            <button className="btn btn-primary" type="button">
              Send Message
            </button>
          </div>

          <p
            style={{
              fontSize: "0.8rem",
              color: "#94a3b8",
              marginTop: 8,
              maxWidth: 420,
            }}
          >
            For urgent payment issues, include your Razorpay payment ID and the
            file name you purchased.
          </p>
        </div>
      </div>
    </div>
  );
}
