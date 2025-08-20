export default function WatermarkedImage({ src, alt, className = '' }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      {/* Simple on-screen watermark (not baked-in) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-white/30 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] font-extrabold rotate-[-25deg] select-none text-4xl md:text-6xl">
          picsellart
        </span>
      </div>
    </div>
  )
}
