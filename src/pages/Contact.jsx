// src/pages/Contact.jsx
import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg mb-10">
        Send us a message — our support team typically replies within{" "}
        <b>24–48 hours</b>.
      </p>

      <form className="space-y-6">
        <input
          type="text"
          placeholder="Your name"
          className="w-full p-4 border rounded-xl bg-white"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="your@email.com"
          className="w-full p-4 border rounded-xl bg-white"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Subject"
          className="w-full p-4 border rounded-xl bg-white"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <textarea
          placeholder="Tell us how we can help…"
          className="w-full p-4 border rounded-xl bg-white h-32"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button
          type="button"
          className="w-full py-4 rounded-xl text-white text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500"
        >
          Send message
        </button>
      </form>

      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          For urgent payment issues
        </h2>
        <p className="text-lg">
          Include your Razorpay payment ID, buyer email, and purchased file
          name. This helps us locate your order faster.
        </p>
        <p className="mt-4 text-gray-600">
          Support hours: <b>Monday – Friday, 10:00 – 18:00 IST</b>.
        </p>
      </div>
    </div>
  );
}
