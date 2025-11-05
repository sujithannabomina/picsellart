// /src/utils/watermark.js
// Very fast client-side watermarking on a canvas. Returns a data URL.

export async function watermark(imgUrl, text = "Picsellart") {
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = imgUrl;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  // Watermark strip
  const pad = Math.max(16, Math.floor(canvas.width * 0.01));
  const fontSize = Math.max(14, Math.floor(canvas.width * 0.025));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  const textMetrics = ctx.measureText(text);
  const stripH = fontSize * 2;
  ctx.fillRect(0, canvas.height - stripH, canvas.width, stripH);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, canvas.height - stripH / 2);

  return canvas.toDataURL("image/jpeg", 0.85);
}

// Optional default export for older imports
export default watermark;
