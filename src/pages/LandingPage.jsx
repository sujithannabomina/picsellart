import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <img src="/logo.png" alt="Picsellart Logo" className="w-32 mb-6" />
      
      <h1 className="text-4xl font-bold mb-4">Turn Your Photos Into Income</h1>
      <p className="text-center max-w-lg mb-6">
        Upload your photos, designs, or creative content and start selling to designers,
        architects, and creators today.
      </p>

      <div className="flex gap-4">
        <a
          href="/seller"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Become a Seller
        </a>
        <a
          href="/buyer"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Explore Photos
        </a>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Secure Payments • Verified Sellers • Instant Downloads
      </p>
    </div>
  );
}
