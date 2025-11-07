// src/components/WatermarkedImage.jsx
export default function WatermarkedImage({ src, alt }) {
  return (
    <div className="relative overflow-hidden rounded-xl border">
      <img src={src} alt={alt} className="block w-full h-auto" loading="lazy" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.20) 0 1px, transparent 1px 20px)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-white/70 backdrop-blur-sm bg-black/20 px-3 py-1 rounded-md text-xs uppercase tracking-wider">
          Picsellart
        </span>
      </div>
    </div>
  );
}
