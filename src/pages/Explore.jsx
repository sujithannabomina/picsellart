import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllExploreImages, filterAndPaginate } from "../utils/storage";

export default function Explore() {
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const data = await fetchAllExploreImages();
      setImages(data);
    }
    load();
  }, []);

  const filtered = filterAndPaginate(images, page, search);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Marketplace</h1>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border px-4 py-2 rounded w-full max-w-md mb-6"
        placeholder="Search images..."
      />

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.data.map((img) => (
          <div key={img.id} className="border rounded-lg p-3 shadow-sm bg-white">

            <img
              src={img.thumbnailUrl}
              alt={img.name}
              className="rounded-md h-40 w-full object-cover cursor-pointer"
              onClick={() => setPreview(img)}
            />

            <h3 className="font-semibold mt-3">{img.category}</h3>
            <p className="text-sm text-gray-500">{img.name}</p>
            <p className="font-bold text-indigo-700">₹{img.price}</p>

            <div className="flex gap-2 mt-3">
              <Link
                to={`/view/${img.id}`}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                View
              </Link>

              <Link
                to={`/buyer-login`}
                className="px-3 py-1 border rounded hover:bg-gray-200"
              >
                Buy
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          disabled={filtered.isLast}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl">
            <img src={preview.watermarkedUrl} className="rounded-lg" />
            <button
              className="mt-4 px-6 py-2 border rounded"
              onClick={() => setPreview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
