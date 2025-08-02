import React from 'react';
import { Link } from 'react-router-dom';

function BuyerDashboard() {
  const mockPhotos = [
    { id: 1, title: "Sunset Over Lake", price: 299, img: "/sample1.jpg" },
    { id: 2, title: "Wildlife in Forest", price: 499, img: "/sample2.jpg" },
    { id: 3, title: "Cityscape at Night", price: 399, img: "/sample3.jpg" },
    { id: 4, title: "Mountain Adventure", price: 599, img: "/sample4.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-blue-600">Welcome, Buyer!</h1>
        <div className="flex gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Wishlist</Link>
          <Link to="/" className="text-gray-600 hover:text-blue-600">Cart</Link>
          <Link to="/" className="text-red-500 font-bold hover:text-red-600">Logout</Link>
        </div>
      </header>

      {/* Search & Filter */}
      <section className="p-6 bg-white shadow flex flex-col md:flex-row gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search photos by title, tag, or seller..."
          className="border p-2 rounded w-full md:w-2/3"
        />
        <select className="border p-2 rounded w-full md:w-1/3">
          <option>Sort by: Most Popular</option>
          <option>Sort by: Price (Low to High)</option>
          <option>Sort by: Price (High to Low)</option>
        </select>
      </section>

      {/* Photo Grid */}
      <section className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
        {mockPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <img src={photo.img} alt={photo.title} className="w-full h-32 object-cover" />
            <div className="p-2">
              <h3 className="text-sm font-semibold">{photo.title}</h3>
              <p className="text-gray-600 text-sm">₹{photo.price}</p>
              <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Buy Now</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default BuyerDashboard;
