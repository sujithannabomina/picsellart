// /src/pages/Contact.jsx
import { useState } from "react";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Suggestion");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder — later you can POST to a serverless function /api/contact
    setSent(true);
  };

  return (
    <main className="page container">
      <h2>Contact</h2>
      <form className="contact" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Suggestion</option>
          <option>Complaint</option>
          <option>Request</option>
        </select>
        <textarea
          placeholder="Write your message…"
          rows={8}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Send</button>
        {sent && <p className="success">Thanks! We received your message.</p>}
      </form>
    </main>
  );
}
