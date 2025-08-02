import React from 'react';
import { Link } from 'react-router-dom';

function SellerDashboard() {
  const mockPhotos = [
    { id: 1, title: "Sunset Over Lake", price: 299, img: "/sample1.jpg", sold: 2 },
    { id: 2, title: "Wildlife in Forest", price: 499, img: "/sample2.jpg", sold: 5 },
    { id: 3, title: "Cityscape at Night", price: 399, img: "/sample3.jpg", sold: 1 },
  ];

  const earnings = 1500; // Mock earnings

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Seller Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/" className="text-red-500 font-bold hover:text-red-600">Logout</Link>
        </div>
      </header>

      {/* Seller Info */}
      <section className="p-6 bg-white shadow flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Welcome, Seller!</h2>
          <p className="text-gray-600">Current Plan: <span className="font-semibold">Plan A - 50 photos / 6 months</span></p>
          <p className="text-gray-600">Photos Uploaded: {mockPhotos.length} / 50</p>
          <p className="text-gray-600">Total Earnings: ₹{earnings}</p>
        </div>
        <button className="mt-4 md:mt-0 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600">
          Upgrade Plan
        </button>
      </section>

      {/* Uploaded Photos */}
      <section className="p-6 flex-1">
        <h3 className="text-lg font-bold mb-4">Your Uploaded Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mockPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <img src={photo.img} alt={photo.title} className="w-full h-32 object-cover" />
              <div className="p-2">
                <h3 className="text-sm font-semibold">{photo.title}</h3>
                <p className="text-gray-600 text-sm">Price: ₹{photo.price}</p>
                <p className="text-green-600 text-sm">Sold: {photo.sold}</p>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Edit</button>
                  <button className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SellerDashboard;
