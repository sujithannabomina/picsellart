// src/pages/Contact.jsx
export default function Contact() {
  return (
    <div className="pageWrap">
      <h2 className="pageTitle">Contact</h2>
      <form className="contactForm" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Your email" required />
        <select defaultValue="Suggestion">
          <option>Suggestion</option>
          <option>Complaint</option>
          <option>Request</option>
        </select>
        <textarea rows={8} placeholder="Write your message..." />
        <button className="btn primary" type="submit">Send</button>
      </form>
    </div>
  );
}
