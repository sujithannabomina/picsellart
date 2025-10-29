export async function watermarkImage(src, text="Picsellart") {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();

  const canvas = document.createElement("canvas");
  const scale = 1; // keep original size for sharpness
  canvas.width = img.naturalWidth * scale;
  canvas.height = img.naturalHeight * scale;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // watermark style
  const mark = text;
  const fontSize = Math.max(18, Math.floor(canvas.width * 0.04));
  ctx.font = `${fontSize}px sans-serif`;
  ctx.rotate(-Math.PI / 8);
  ctx.globalAlpha = 0.25;

  // tiled diagonal
  const stepX = fontSize * 8;
  const stepY = fontSize * 5;
  for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
    for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
      ctx.fillStyle = "#000";
      ctx.fillText(mark, x, y);
      ctx.fillStyle = "#fff";
      ctx.fillText(mark, x + 2, y + 2);
    }
  }
  ctx.globalAlpha = 1;
  ctx.setTransform(1,0,0,1,0,0);

  return canvas.toDataURL("image/jpeg", 0.85);
}
