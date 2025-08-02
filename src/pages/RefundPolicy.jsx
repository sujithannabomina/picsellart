import React from 'react';

function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Refund Policy</h1>
      <div className="max-w-2xl w-full space-y-4">
        <p className="text-gray-600">
          Buyer purchases may be refunded if the downloaded image is defective or corrupted.
        </p>
        <p className="text-gray-600">
          Seller plan payments are <strong>non-refundable</strong> as they are subscription-based and grant upload access.
        </p>
        <p className="text-gray-600">
          For refund requests, please contact us at <a href="mailto:picsellart.in@gmail.com" className="text-blue-600 underline">picsellart.in@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}

export default RefundPolicy;
