import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [ok, setOk] = useState(false);

  async function submit(e) {
    e.preventDefault();
    await addDoc(collection(db, "messages"), {
      ...form,
      createdAt: serverTimestamp(),
    });
    setOk(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <section className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6">Contact Us</h1>
      {ok && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700">Thanks! We’ll get back within 24–48 hours.</div>}
      <form onSubmit={submit} className="card p-6 grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input className="w-full px-3 py-2 rounded-lg ring-1 ring-slate-300"
                 value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-3 py-2 rounded-lg ring-1 ring-slate-300"
                 value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input className="w-full px-3 py-2 rounded-lg ring-1 ring-slate-300"
                 value={form.subject} onChange={(e)=>setForm(f=>({...f,subject:e.target.value}))} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea rows={6} className="w-full px-3 py-2 rounded-lg ring-1 ring-slate-300"
                    value={form.message} onChange={(e)=>setForm(f=>({...f,message:e.target.value}))} required />
        </div>
        <div><button className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold">Send Message</button></div>
      </form>
    </section>
  );
}
