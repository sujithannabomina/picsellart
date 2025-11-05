// src/pages/PhotoDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WatermarkedImage from "../components/WatermarkedImage";
import { getPublicImageByName } from "../utils/storage";

export default function PhotoDetails() {
  const { name } = useParams(); // file name (e.g., "sample3.jpg")
  const [img, setImg] = useState(null);

  useEffect(() => {
    const result = getPublicImageByName(name);
    setImg(result);
  }, [name]);

  if (!img) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-gray-500">Photo not found.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <WatermarkedImage src={img.url} alt={img.name} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{img.name}</h1>
          <p className="mt-2 text-gray-600">
            High-quality photo from the Picsellart sample gallery.
          </p>
          {/* Put pricing / add-to-cart / buy-now here when you wire to orders */}
        </div>
      </div>
    </main>
  );
}
