// src/pages/Contact.jsx
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";                 // ✅ use the single, shared instance
import { useAuth } from "../context/AuthContext"; // optional: attach user info

const Contact = () => {
  const { user } = useAuth() || {};
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (status.type) setStatus({ type: "", msg: "" });
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    // simple email check
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.subject.trim()) return "Please enter a subject.";
    if (!form.message.trim()) return "Please enter a message.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setStatus({ type: "error", msg: v });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        createdAt: serverTimestamp(),
        // attach user context when available
        userUid: user?.uid || null,
        userEmail: user?.email || null,
        userDisplayName: user?.displayName || null,
        // request ip/ua left to backend/edge if needed
      };

      await addDoc(collection(db, "contactMessages"), payload);

      setStatus({
        type: "success",
        msg: "Thanks! Your message has been sent. We’ll get back to you shortly.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact submit failed:", err);
      setStatus({
        type: "error",
        msg:
          "Could not send your message right now. Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>

      {status.type === "success" && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          {status.msg}
        </div>
      )}
      {status.type === "error" && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="jane@example.com"
            autoComplete="email"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="I have a question about…"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={onChange}
            className="w-full min-h-[140px] rounded-lg border px-3 py-2 outline-none focus:ring"
            placeholder="Write your message here…"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send Message"}
        </button>
      </form>

      <p className="mt-6 text-xs text-neutral-500">
        We respect your privacy. Your message is stored securely and visible
        only to site admins.
      </p>
    </div>
  );
};

export default Contact;
