import React from 'react';

function FAQ() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Frequently Asked Questions</h1>
      <div className="max-w-2xl w-full space-y-4">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold">How do I start selling photos?</h3>
          <p className="text-gray-600 text-sm">Create a seller account, choose a plan, and upload your photos. Buyers can then purchase your content directly.</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold">How do I get paid?</h3>
          <p className="text-gray-600 text-sm">Payments are processed via Razorpay and credited to your linked bank account.</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="font-semibold">Are seller payments refundable?</h3>
          <p className="text-gray-600 text-sm">No, seller plan payments are non-refundable. Buyer purchases may be refunded if eligible.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
