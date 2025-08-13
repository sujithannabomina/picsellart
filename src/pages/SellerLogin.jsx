import React from "react";

const SellerLogin = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Seller Login</h2>
        <input type="email" placeholder="Email" className="w-full border p-2 mb-4 rounded" />
        <input type="password" placeholder="Password" className="w-full border p-2 mb-4 rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </div>
    </div>
  );
};

export default SellerLogin;