import React from "react";

const SellerDashboard = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-4">Seller Dashboard</h2>
      <p className="text-center text-lg text-gray-700">
        Here you can upload and manage your images, view earnings, and track performance.
      </p>
      <div className="mt-8 text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Upload Images</button>
      </div>
    </div>
  );
};

export default SellerDashboard;