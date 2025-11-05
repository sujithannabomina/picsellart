import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPublicImages } from "../utils/storage";
import WatermarkedImage from "../components/WatermarkedImage";

export default function Explore() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [data, setData] = useState({ items: [], total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const { items, total } = listPublicImages(page, pageSize);
    setData({ items, total });
  }, [page, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.total / pageSize)),
    [data.total, pageSize]
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Explore Pictures</h1>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.items.map((img) => (
          <button
            key={img.name}
            className="text-left"
            onClick={() => navigate(`/photo/${encodeURIComponent(img.name)}`)}
          >
            <WatermarkedImage src={img.url} alt={img.name} />
            <div className="mt-2 text-sm">{img.name}</div>
          </button>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </main>
  );
}
