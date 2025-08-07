// src/pages/SellerLogin.jsx
import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const SellerLogin = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/seller-dashboard";
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Seller Login</h1>
      <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
    </div>
  );
};

export default SellerLogin;
