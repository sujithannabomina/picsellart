export default function WatermarkedImage({ src, alt }) {
  return (
    <div className="relative">
      <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      <div className="absolute inset-0 pointer-events-none grid place-items-center opacity-30">
        <span className="text-3xl font-bold select-none">P I C S E L L A R T</span>
      </div>
    </div>
  );
}
