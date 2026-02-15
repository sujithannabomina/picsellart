// File: src/components/Pagination.jsx

import React from "react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-4 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition disabled:opacity-40"
      >
        Prev
      </button>

      <div className="text-sm font-medium text-slate-700">
        Page <span className="font-semibold text-slate-900">{page}</span>{" "}
        <span className="text-slate-400">/</span>{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
