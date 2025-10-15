import { useState } from "react";
import { db } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Contact(){
  const [email, setEmail] = useState("");
  const [type, setType] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "contact_messages"), { email, type, message, createdAt: serverTimestamp() });
    setSent(true); setEmail(""); setType("suggestion"); setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold my-8">Contact</h2>
      {sent && <p className="text-green-700 mb-4">Sent! We’ll reply by email.</p>}
      <form onSubmit={submit} className="grid gap-4">
        <input className="border rounded px-3 py-2" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <select className="border rounded px-3 py-2" value={type} onChange={e=>setType(e.target.value)}>
          <option value="suggestion">Suggestion</option>
          <option value="complaint">Complaint</option>
          <option value="request">Request</option>
        </select>
        <textarea className="border rounded px-3 py-2" rows="6" placeholder="Write your message..." value={message} onChange={e=>setMessage(e.target.value)} required/>
        <button className="btn btn-primary w-fit">Send</button>
      </form>
    </div>
  );
}
