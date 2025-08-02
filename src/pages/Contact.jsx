import React from 'react';

function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Contact Us</h1>
      <p className="text-gray-700 mb-4">For any queries, reach out to us:</p>
      <a href="mailto:picsellart.in@gmail.com" className="text-blue-600 underline text-lg">
        picsellart.in@gmail.com
      </a>
    </div>
  );
}

export default Contact;
