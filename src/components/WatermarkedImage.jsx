// src/components/WatermarkedImage.jsx
const WatermarkedImage = ({
  src,
  alt,
  watermarkText = "Picsellart",
  className = "",
  style = {},
}) => {
  const containerStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "18px",
    backgroundColor: "#111827",
    ...style,
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    background:
      "radial-gradient(circle at center, rgba(0,0,0,0.2), rgba(0,0,0,0.55))",
  };

  const textStyle = {
    color: "rgba(255,255,255,0.9)",
    fontWeight: 700,
    fontSize: "1.1rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    transform: "rotate(-24deg)",
    whiteSpace: "nowrap",
    opacity: 0.75,
  };

  return (
    <div className={`watermarked-container ${className}`} style={containerStyle}>
      <img src={src} alt={alt} style={imgStyle} />
      <div style={overlayStyle}>
        <span style={textStyle}>{watermarkText}</span>
      </div>
    </div>
  );
};

export default WatermarkedImage;
