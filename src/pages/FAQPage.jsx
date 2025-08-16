import React from "react";

const faqs = [
  {
    question: "What is Picsellart?",
    answer: "Picsellart is a digital marketplace where photographers and designers can sell their original work securely.",
  },
  {
    question: "How do I upload my photos as a seller?",
    answer: "Once registered as a seller, you can upload images from your dashboard after logging in.",
  },
  {
    question: "Are my images protected with watermarks?",
    answer: "Yes, all preview images are automatically watermarked to protect your content.",
  },
  {
    question: "How do buyers pay?",
    answer: "Buyers can securely pay using Razorpay before downloading full-resolution photos.",
  },
  {
    question: "What are the accepted file formats?",
    answer: "Currently, we accept high-resolution JPG, JPEG, and PNG files.",
  },
  {
    question: "Can I use the purchased photo commercially?",
    answer: "Yes. All purchases come with a license for personal and commercial use.",
  },
  {
    question: "Where can I get support?",
    answer: "You can email us at picsellart@gmail.com for any help or questions.",
  },
];

const Faq = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900">{faq.question}</h2>
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
