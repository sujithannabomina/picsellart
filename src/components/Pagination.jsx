export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-600">
      <button
        onClick={() => !prevDisabled && onChange(page - 1)}
        disabled={prevDisabled}
        className="rounded-full border border-slate-300 bg-white px-3 py-1 disabled:opacity-40 hover:bg-slate-50"
      >
        Prev
      </button>
      <span>
        Page <span className="font-semibold">{page}</span>{" "}
        <span className="text-slate-400">/ {totalPages}</span>
      </span>
      <button
        onClick={() => !nextDisabled && onChange(page + 1)}
        disabled={nextDisabled}
        className="rounded-full border border-slate-300 bg-white px-3 py-1 disabled:opacity-40 hover:bg-slate-50"
      >
        Next
      </button>
    </div>
  );
}
