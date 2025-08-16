import React, { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const BuyerDashboard = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const storage = getStorage();
      const listRef = ref(storage, "buyer");
      try {
        const res = await listAll(listRef);
        const urls = await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)));
        setImages(urls);
      } catch (error) {
        console.error("Error fetching buyer images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-center">Buyer Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <img key={index} src={url} alt={`Buyer Photo ${index + 1}`} className="rounded shadow-lg" />
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;