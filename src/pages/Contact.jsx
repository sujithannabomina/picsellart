// src/pages/Contact.jsx
import { useState } from "react";
import Header from "../components/Header";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Contact() {
  const { user } = useAuth() || {};
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setOk("");
    try {
      await addDoc(collection(db, "contact_messages"), {
        ...form,
        createdAt: serverTimestamp(),
        fromUid: user?.uid || null,
      });
      setOk("Thanks! We received your message.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Could not send message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-4xl font-extrabold text-slate-900">Contact Us</h1>
        <p className="text-slate-700 mt-2">
          Send a message—our team replies within 24–48 hours.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium">Your Name</label>
            <input
              className="mt-1 w-full border rounded-md px-3 py-2"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full border rounded-md px-3 py-2"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              className="mt-1 w-full border rounded-md px-3 py-2"
              name="subject"
              value={form.subject}
              onChange={onChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="mt-1 w-full border rounded-md px-3 py-2"
              name="message"
              rows={5}
              value={form.message}
              onChange={onChange}
              required
            />
          </div>
          <button
            disabled={busy}
            className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send Message"}
          </button>
          {ok && <p className="text-green-700 text-sm mt-2">{ok}</p>}
        </form>
      </main>
    </>
  );
}
