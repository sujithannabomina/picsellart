import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Picsellart</Link>
      <div className="space-x-4">
        <Link to="/explore" className="hover:text-blue-500">Explore</Link>
        <Link to="/seller-login" className="hover:text-blue-500">Seller Login</Link>
        <Link to="/buyer-login" className="hover:text-blue-500">Buyer Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;

// File: src/components/ImageCard.jsx
import React from 'react';

const ImageCard = ({ imageUrl, title, price }) => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-60 object-cover" />
      <div className="p-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">Price: ₹{price}</p>
      </div>
    </div>
  );
};

export default ImageCard;

// File: src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center my-4 space-x-2">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 border rounded ${
            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;

// File: src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// File: src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="text-center mt-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Picsellart</h1>
        <p className="text-gray-600 mb-6">Your platform for buying and selling creative photos.</p>
        <div className="space-x-4">
          <Link to="/seller-login" className="px-4 py-2 bg-blue-500 text-white rounded">Seller Login</Link>
          <Link to="/buyer-login" className="px-4 py-2 bg-green-500 text-white rounded">Buyer Login</Link>
        </div>
        <div className="mt-10 flex justify-center gap-6">
          <img src="/sample1.jpg" alt="Sample 1" className="w-48 rounded shadow" />
          <img src="/sample2.jpg" alt="Sample 2" className="w-48 rounded shadow" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;