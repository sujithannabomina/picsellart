export default function WatermarkedImage({ src, alt, overlay = false }) {
  return (
    <div className="img-wrap">
      <img src={src} alt={alt} loading="lazy" />
      {overlay && <div className="wm-badge">PICSELLART</div>}
    </div>
  );
}
