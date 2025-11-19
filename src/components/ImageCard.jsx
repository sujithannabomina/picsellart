import { Link } from "react-router-dom";

export default function ImageCard({ photo }) {
  const { path, name, url, price } = photo;

  return (
    <div className="flex flex-col rounded-3xl bg-white shadow-[0_14px_32px_rgba(15,23,42,0.16)] overflow-hidden">
      {/* Image with watermark */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-200">
        <img
          src={url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-white/85 text-2xl font-semibold tracking-[0.35em] [text-shadow:0_0_12px_rgba(0,0,0,1)]">
            PICSELLART
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Street Photography
          </p>
          <p className="text-xs text-slate-500 truncate">{name}</p>
        </div>

        <p className="text-base font-semibold text-slate-900">
          ₹{price.toLocaleString("en-IN")}
        </p>

        <div className="mt-1 mb-2 flex gap-2">
          <Link
            to={`/view/${encodeURIComponent(path)}`}
            className="flex-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 text-center hover:bg-slate-50"
          >
            View
          </Link>
          <Link
            to={`/buyer-login`}
            className="flex-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white text-center hover:bg-slate-800"
          >
            Buy &amp; Download
          </Link>
        </div>
      </div>
    </div>
  );
}
