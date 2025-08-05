import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col">
      
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Picsellart Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-gray-800">Picsellart</h1>
        </div>
        <nav className="space-x-6">
          <Link to="/buyer" className="text-gray-600 hover:text-gray-900">
            Explore
          </Link>
          <Link to="/seller" className="text-gray-600 hover:text-gray-900">
            Sell
          </Link>
          <Link to="/faq" className="text-gray-600 hover:text-gray-900">
            FAQ
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center text-center py-16 px-6 flex-grow">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Turn Your Photos into Income
        </h2>
        <p className="text-gray-600 max-w-2xl mb-8">
          Join our marketplace where photographers, designers, and creators
          monetize their work. Buyers get instant access to unique, premium
          images for their projects.
        </p>

        <div className="space-x-4 mb-12">
          <Link
            to="/seller"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Become a Seller
          </Link>
          <Link
            to="/buyer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Explore Photos
          </Link>
        </div>

        {/* SAMPLE IMAGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-4">
          <img
            src="/sample1.jpg"
            alt="Sample 1"
            className="rounded-lg shadow-md hover:scale-105 transition transform"
          />
          <img
            src="/sample2.jpg"
            alt="Sample 2"
            className="rounded-lg shadow-md hover:scale-105 transition transform"
          />
          <img
            src="/sample3.jpg"
            alt="Sample 3"
            className="rounded-lg shadow-md hover:scale-105 transition transform"
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white py-6 text-center border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Picsellart. All rights reserved.
        </p>
        <div className="space-x-4 mt-2">
          <Link to="/refund" className="text-gray-500 hover:text-gray-800 text-sm">
            Refund Policy
          </Link>
          <Link to="/faq" className="text-gray-500 hover:text-gray-800 text-sm">
            FAQ
          </Link>
          <Link to="/contact" className="text-gray-500 hover:text-gray-800 text-sm">
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
