import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 flex flex-col items-center justify-center px-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">📸 Picsellart</h1>
        <p className="text-lg text-gray-700 max-w-xl">
          Discover, Sell & Download Stunning Visuals. Empowering Street Photographers, Designers, and Artists.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        <Link to="/buyer" className="bg-white shadow-lg rounded-xl p-6 hover:bg-gray-50 text-center transition">
          <h2 className="text-2xl font-bold mb-2">Explore Photos</h2>
          <p className="text-gray-600">Browse 100+ stunning street photos.</p>
        </Link>

        <Link to="/seller-login" className="bg-white shadow-lg rounded-xl p-6 hover:bg-gray-50 text-center transition">
          <h2 className="text-2xl font-bold mb-2">Seller Login</h2>
          <p className="text-gray-600">Login to upload your artwork & manage sales.</p>
        </Link>

        <Link to="/buyer-login" className="bg-white shadow-lg rounded-xl p-6 hover:bg-gray-50 text-center transition">
          <h2 className="text-2xl font-bold mb-2">Buyer Login</h2>
          <p className="text-gray-600">Create an account and download premium photos.</p>
        </Link>
      </div>

      <footer className="text-center text-sm text-gray-500 space-x-4">
        <Link to="/faq" className="hover:underline">FAQ</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
        <Link to="/refund" className="hover:underline">Refund Policy</Link>
      </footer>
    </div>
  );
}

export default LandingPage;
