// src/components/WatermarkedImage.jsx
export default function WatermarkedImage({src, alt}){
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <img src={src} alt={alt} loading="lazy" className="w-full h-64 object-cover" />
      <div className="watermark" aria-hidden />
    </div>
  );
}
