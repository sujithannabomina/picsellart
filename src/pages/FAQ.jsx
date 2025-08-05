import React from "react";

function FAQ() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">1. How do I sell photos?</h2>
        <p>Create a seller account, upload your photos, and set a price.</p>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">2. How do I withdraw my earnings?</h2>
        <p>Your earnings are sent directly to your registered bank account.</p>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold">3. Are my photos protected?</h2>
        <p>Yes, all photos have watermarks until purchased by a buyer.</p>
      </div>
    </div>
  );
}

export default FAQ;
