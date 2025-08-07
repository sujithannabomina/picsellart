// src/pages/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import { storage, ref, listAll, getDownloadURL } from "../firebase";

const BuyerDashboard = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      const folderRef = ref(storage, "buyer");
      const result = await listAll(folderRef);
      const urls = await Promise.all(
        result.items.map(async (itemRef, i) => {
          const url = await getDownloadURL(itemRef);
          return {
            id: i + 1,
            url,
            title: `StreetPhotography ${i + 1}`,
            price: Math.floor(150 + Math.random() * 400),
          };
        })
      );
      setImages(shuffleArray(urls).slice(0, 25)); // 25 random
    };

    fetchImages();
  }, []);

  const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());

  const filtered = images.filter((img) =>
    img.title.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.title.localeCompare(b.title)); // Sorted by title

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Buyer Dashboard</h1>
      <input
        type="text"
        placeholder="Search photos..."
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <div key={photo.id} className="border rounded shadow">
            <img src={photo.url} alt={photo.title} className="w-full h-48 object-cover opacity-90" />
            <div className="p-2">
              <h2 className="font-semibold">{photo.title}</h2>
              <p className="text-green-600 font-bold">₹{photo.price}</p>
              <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded">
                Buy & Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
