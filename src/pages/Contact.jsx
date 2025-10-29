import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import firebaseConfig from "../firebase";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TOPICS = [
  { value: "Suggestion", label: "Suggestion" },
  { value: "Complaint", label: "Complaint" },
  { value: "Request", label: "Request" },
  { value: "Other", label: "Other" },
];

export default function Contact() {
  const { user, role } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  // simple honeypot
  const [website, setWebsite] = useState("");

  const validate = () => {
    const okEmail = /^\S+@\S+\.\S+$/.test(email.trim());
    if (!okEmail) return "Please enter a valid email.";
    if (message.trim().length < 10) return "Please write a little more detail (min 10 characters).";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (website) { // bot
      setDone(true);
      return;
    }
    const v = validate();
    if (v) { setErr(v); return; }
    try {
      setSending(true);
      await addDoc(collection(db, "contactMessages"), {
        email: email.trim(),
        topic,
        message: message.trim(),
        uid: user?.uid || null,
        role: role || null,
        createdAt: serverTimestamp(),
      });
      setDone(true);
      setMessage("");
    } catch (e) {
      setErr(e.message || "Failed to send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <h1>Contact</h1>
      <p style={{color:"#475569", marginBottom:16}}>
        Questions, feedback, or an issue with a purchase? Send us a message and we’ll respond by email.
      </p>

      {done ? (
        <div className="notice ok">Thanks! Your message has been sent. We’ll reply to {email}.</div>
      ) : (
        <form className="contact-form" onSubmit={submit}>
          <label className="lbl">
            Your email
            <input
              type="email"
              className="inp"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </label>

          <label className="lbl">
            Topic
            <select className="inp" value={topic} onChange={(e)=>setTopic(e.target.value)}>
              {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>

          <label className="lbl">
            Write your message…
            <textarea
              className="inp"
              rows={6}
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              placeholder="Please include order ID or photo name if relevant."
              required
            />
          </label>

          {/* honeypot (hidden from humans) */}
          <input
            style={{position:"absolute", left:"-9999px"}}
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e)=>setWebsite(e.target.value)}
            placeholder="Leave this field empty"
          />

          {err && <div className="notice err">{err}</div>}
          <button className="pill blue" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
      )}

      <style>{`
        .contact-form{max-width:720px;display:flex;flex-direction:column;gap:14px}
        .lbl{display:flex;flex-direction:column;gap:8px;font-weight:600}
        .inp{border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;font:inherit}
        textarea.inp{resize:vertical}
        .notice{padding:12px 14px;border-radius:10px;margin:8px 0}
        .notice.ok{background:#ecfeff;border:1px solid #06b6d4;color:#0e7490}
        .notice.err{background:#fef2f2;border:1px solid #fca5a5;color:#991b1b}
      `}</style>
    </div>
  );
}
