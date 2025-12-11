// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    pages.push(p);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1)))}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-full border text-xs disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-full text-xs font-medium ${
            p === page
              ? "bg-violet-600 text-white"
              : "border border-slate-300 text-slate-700 hover:border-violet-400"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1)))}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-full border text-xs disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
