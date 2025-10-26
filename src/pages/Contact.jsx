import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Suggestion");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e){
    e.preventDefault();
    // If you later add an API route: await fetch('/api/contact', {...})
    setSent(true);
  }

  return (
    <main className="section">
      <div className="container page">
        <h2>Contact</h2>
        <p className="muted">We usually respond within 1–2 business days.</p>

        {sent ? (
          <p><strong>Thanks!</strong> We received your message.</p>
        ) : (
          <form className="form mt-4" onSubmit={onSubmit}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 220px", gap:"12px"}}>
              <input
                className="input"
                placeholder="Your email"
                type="email"
                required
                value={email}
                onChange={e=>setEmail(e.target.value)}
              />
              <select className="select" value={type} onChange={e=>setType(e.target.value)}>
                <option>Suggestion</option>
                <option>Support</option>
                <option>Billing</option>
                <option>Abuse Report</option>
              </select>
            </div>

            <textarea
              className="input textarea"
              placeholder="Write your message..."
              required
              value={message}
              onChange={e=>setMessage(e.target.value)}
            />

            <button className="primary btn" type="submit">Send</button>
          </form>
        )}
      </div>
    </main>
  );
}
