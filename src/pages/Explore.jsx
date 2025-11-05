// src/pages/Explore.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WatermarkedImage from "../components/WatermarkedImage";
import { listPublicImages } from "../utils/storage";

const PAGE_SIZE = 24;

export default function Explore() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { items, total } = listPublicImages(page, PAGE_SIZE);
    setItems(items);
    setTotal(total);
  }, [page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Explore Pictures</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((img) => (
            <button
              key={img.name}
              className="text-left group"
              onClick={() => navigate(`/photo/${encodeURIComponent(img.name)}`)}
              aria-label={`Open ${img.name}`}
            >
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <WatermarkedImage src={img.url} alt={img.name} />
              </div>
              <div className="mt-2 text-sm text-gray-700 truncate">{img.name}</div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </main>
  );
}
