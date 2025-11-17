import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getExploreImageById } from "../utils/storage";
import { useAuth } from "../hooks/useAuth";

export default function ViewImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [image, setImage] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getExploreImageById(id);
      setImage(data);
    }
    load();
  }, [id]);

  if (!image) return <p className="p-10 text-center">Loading image...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{image.category}</h1>

      <img
        src={image.watermarkedUrl}
        alt={image.name}
        className="w-full rounded-lg shadow"
      />

      <p className="mt-4 text-gray-700">{image.name}</p>
      <p className="mt-1 font-semibold text-lg">₹{image.price}</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => {
            if (!user) return navigate("/buyer-login");
            navigate(`/buy/${image.id}`);
          }}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Buy & Download
        </button>

        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border rounded-lg hover:bg-gray-100"
        >
          Back
        </button>
      </div>
    </div>
  );
}
