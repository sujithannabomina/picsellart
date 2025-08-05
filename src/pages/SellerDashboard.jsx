import React, { useState } from "react";

function SellerDashboard() {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");

  const handleUpload = () => {
    if (!title || !tags || !price) return alert("Please fill all fields");
    const newPhoto = {
      id: photos.length + 1,
      title,
      tags: tags.split(","),
      price,
      img: "/sample1.jpg", // Placeholder, real upload comes later
    };
    setPhotos([...photos, newPhoto]);
    setTitle("");
    setTags("");
    setPrice("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Photo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border rounded w-full mb-2"
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Upload Photo
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Your Uploaded Photos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded shadow p-3">
            <img src={photo.img} alt={photo.title} className="rounded mb-2" />
            <h2 className="font-bold">{photo.title}</h2>
            <p className="text-gray-500 text-sm">
              Tags: {photo.tags.join(", ")}
            </p>
            <p className="text-green-600 font-semibold">₹{photo.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerDashboard;
