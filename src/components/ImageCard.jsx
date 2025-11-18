import { Link } from "react-router-dom";

export default function ImageCard({ photo }) {
  const { fullPath, name, price, url, title } = photo;
  const encodedPath = encodeURIComponent(fullPath);

  return (
    <article className="flex flex-col justify-between rounded-3xl bg-white p-3 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div>
        <div className="relative overflow-hidden rounded-2xl">
          <div className="aspect-[4/3]">
            <img
              src={url}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Stronger watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-white/85 text-3xl font-semibold tracking-[0.35em] drop-shadow-lg mix-blend-overlay">
              PICSELLART
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-semibold text-slate-900">
            {title || "Street Photography"}
          </h3>
          <p className="text-xs text-slate-500">{name}</p>
          <p className="pt-1 text-sm font-semibold text-slate-900">
            ₹{price}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Link
          to={`/view/${encodedPath}`}
          className="flex-1 rounded-full border border-slate-300 px-3 py-1.5 text-center text-xs font-semibold text-slate-800 hover:border-slate-400"
        >
          View
        </Link>
        <button
          type="button"
          className="flex-1 rounded-full bg-slate-900 px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-slate-800"
        >
          Buy &amp; Download
        </button>
      </div>
    </article>
  );
}
