import React from "react";

const RefundPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Refund Policy</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          All photo sales on Picsellart are considered final. Since the products are digital in nature,
          we do not offer refunds after the file has been downloaded.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          If there is any issue with your purchase or you received the wrong file, please contact us at
          <span className="text-blue-600 font-medium"> picsellart@gmail.com</span> within 7 days of purchase.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
