import React, { useState } from "react";

function BuyerDashboard() {
  const [search, setSearch] = useState("");
  const [photos] = useState([
    { id: 1, title: "Wildlife Tiger", price: 250, img: "/sample1.jpg" },
    { id: 2, title: "Modern Architecture", price: 300, img: "/sample2.jpg" },
    { id: 3, title: "Street Photography", price: 150, img: "/sample3.jpg" },
  ]);

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Buyer Dashboard</h1>
      <input
        type="text"
        placeholder="Search photos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded mb-6 w-full max-w-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded shadow p-3">
            <img src={photo.img} alt={photo.title} className="rounded mb-2" />
            <h2 className="font-bold">{photo.title}</h2>
            <p className="text-green-600 font-semibold">₹{photo.price}</p>
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
              Buy & Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerDashboard;
