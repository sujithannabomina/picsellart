import React, { useState } from "react";

export default function BuyerDashboard() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [photos] = useState([
    { id: 1, title: "Street Photography", price: 250, img: "/sample4.jpg", likes: 10 },
    { id: 2, title: "Street Photography", price: 300, img: "/sample5.jpg", likes: 25 },
    { id: 3, title: "Street Photography", price: 150, img: "/sample6.jpg", likes: 5 },
  ]);

  // Filter photos
  const filteredPhotos = photos
    .filter((photo) =>
      photo.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "likes") return b.likes - a.likes;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Buyer Dashboard</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search photos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <select
          className="p-2 border rounded w-full sm:w-1/4"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded shadow relative">
            {/* Watermarked Image */}
            <img src={photo.img} alt={photo.title} className="rounded opacity-70" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg font-bold opacity-70 rotate-12">
              PICSSELLART
            </span>

            <div className="p-3">
              <h2 className="font-bold">{photo.title}</h2>
              <p className="text-green-600 font-semibold">₹{photo.price}</p>
              <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                Buy & Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
