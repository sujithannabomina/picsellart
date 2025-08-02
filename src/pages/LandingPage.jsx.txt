import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Loading Screen */}
      <div id="loading-screen" className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50 animate-fadeOut">
        <img src="/logo.png" alt="Picsellart Logo" className="h-20 w-20 animate-pulse" />
      </div>

      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-center items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="h-8" />
          <h1 className="text-2xl font-bold text-blue-600">picsellart</h1>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Turn Your Photos Into Income</h2>
        <p className="text-gray-600 mb-8">Upload your designs, photos, or creative content and start selling to designers, architects, and creators today.</p>
        <div className="flex justify-center gap-4">
          <Link to="/seller" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Start Selling</Link>
          <Link to="/buyer" className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600">Explore Photos</Link>
        </div>
        {/* Mock hero images */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 px-8">
          <img src="/sample1.jpg" className="rounded-lg shadow hover:scale-105 transition" alt="sample"/>
          <img src="/sample2.jpg" className="rounded-lg shadow hover:scale-105 transition" alt="sample"/>
          <img src="/sample3.jpg" className="rounded-lg shadow hover:scale-105 transition" alt="sample"/>
          <img src="/sample4.jpg" className="rounded-lg shadow hover:scale-105 transition" alt="sample"/>
        </div>
      </section>

      {/* Why Sell Section */}
      <section className="py-16 text-center bg-white">
        <h3 className="text-2xl font-bold mb-6">Why Sell on picsellart?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h4 className="font-semibold mb-2">Zero Hassle</h4>
            <p>Upload your photos in minutes and set your own price.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h4 className="font-semibold mb-2">Instant Payments</h4>
            <p>Get paid directly to your bank with every sale.</p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-lg transition">
            <h4 className="font-semibold mb-2">Creative Freedom</h4>
            <p>Sell wildlife, portraits, or designs and reach real buyers.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 text-white py-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Join 100+ sellers today!</h3>
        <Link to="/seller" className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600">
          Become a Seller
        </Link>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-100 py-8 flex justify-center gap-12">
        <div className="text-center">
          <span className="text-2xl">🔒</span>
          <p className="text-gray-600 text-sm">Secure Payments</p>
        </div>
        <div className="text-center">
          <span className="text-2xl">✔️</span>
          <p className="text-gray-600 text-sm">Verified Sellers</p>
        </div>
        <div className="text-center">
          <span className="text-2xl">⚡</span>
          <p className="text-gray-600 text-sm">Fast Downloads</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center py-6 mt-auto border-t">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          <Link to="/refund" className="text-gray-600 hover:text-blue-600">Refund Policy</Link>
        </div>
        <div className="flex justify-center gap-6 mb-4 text-gray-500">
          <span>📸 Instagram</span>
          <span>📘 Facebook</span>
          <span>🐦 Twitter</span>
        </div>
        <p className="text-gray-500 text-sm">© 2025 picsellart. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
