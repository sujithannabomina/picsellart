// src/pages/Contact.jsx
const Contact = () => {
  return (
    <main className="page-shell">
      <section className="page-header-block">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">
          Send a message – our small team typically replies within 24–48 hours.
        </p>
      </section>

      <section className="page-grid-two">
        <div className="page-card">
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! This demo form does not send emails yet.");
            }}
          >
            <label>
              Your name
              <input type="text" name="name" placeholder="Jane Doe" required />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Subject
              <input
                type="text"
                name="subject"
                placeholder="Question or feedback"
                required
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="4"
                placeholder="Tell us how we can help…"
                required
              />
            </label>
            <button type="submit" className="btn-primary wide">
              Send message
            </button>
          </form>
        </div>

        <aside className="page-card contact-side">
          <h2>For urgent payment issues</h2>
          <p>
            Include your Razorpay payment ID, buyer email address and the file
            name you purchased. This helps us locate your order quickly.
          </p>
          <p className="contact-meta">
            Support hours: Monday – Friday, 10:00 – 18:00 IST.
          </p>
        </aside>
      </section>
    </main>
  );
};

export default Contact;
