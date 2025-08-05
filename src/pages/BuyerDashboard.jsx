import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const BuyerDashboard = () => {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 12;

  useEffect(() => {
    const fetchImages = async () => {
      const folderRef = ref(storage, "buyer/");
      const imageList = await listAll(folderRef);

      const urls = await Promise.all(
        imageList.items.map(async (item, index) => {
          const url = await getDownloadURL(item);
          return {
            id: index + 1,
            title: "StreetPhotography",
            price: Math.floor(Math.random() * 500) + 100,
            imgUrl: url,
          };
        })
      );

      setPhotos(urls);
    };

    fetchImages();
  }, []);

  // Filter + Sort photos
  const filteredPhotos = photos
    .filter((photo) =>
      photo.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  // Pagination
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const startIndex = (currentPage - 1) * photosPerPage;
  const paginatedPhotos = filteredPhotos.slice(
    startIndex,
    startIndex + photosPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search photos..."
        className="mb-6 p-3 border border-gray-300 rounded w-full max-w-md"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-lg shadow-md overflow-hidden relative"
          >
            <div className="relative">
              <img
                src={photo.imgUrl}
                alt={photo.title}
                className="w-full h-48 object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold opacity-50">
                PICSELLART
              </span>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{photo.title}</h2>
              <p className="text-green-600 font-bold mt-1">₹{photo.price}</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Buy & Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
