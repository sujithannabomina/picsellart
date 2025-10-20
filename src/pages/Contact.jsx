// src/pages/Contact.jsx
export default function Contact(){
  return (
    <div className="container py-10">
      <h1>Contact</h1>
      <div className="card p-6 bg-slate-50">
        <form className="grid md:grid-cols-2 gap-4">
          <input className="input" type="email" placeholder="Your email" />
          <select className="input">
            <option>Suggestion</option>
            <option>Refund</option>
            <option>License</option>
          </select>
          <textarea className="input md:col-span-2" rows="5" placeholder="Write your message..." />
          <div>
            <button type="button" className="btn">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
