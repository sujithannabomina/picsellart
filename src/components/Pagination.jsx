export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 text-xs text-slate-700">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        className={`rounded-full border px-3 py-1 ${
          canPrev
            ? "border-slate-300 hover:border-slate-400"
            : "cursor-not-allowed border-slate-200 text-slate-400"
        }`}
      >
        Prev
      </button>
      <span className="text-slate-500">
        Page <span className="font-semibold text-slate-900">{currentPage}</span>{" "}
        / {totalPages}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(currentPage + 1)}
        className={`rounded-full border px-3 py-1 ${
          canNext
            ? "border-slate-300 hover:border-slate-400"
            : "cursor-not-allowed border-slate-200 text-slate-400"
        }`}
      >
        Next
      </button>
    </div>
  );
}
