// src/pages/BuyerLogin.jsx
import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const BuyerLogin = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/buyer-dashboard";
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Buyer Login</h1>
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
    </div>
  );
};

export default BuyerLogin;
