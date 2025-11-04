// src/utils/watermark.js
// Draws a repeated diagonal watermark on top of an image URL and returns a data URL.

export async function watermark(imageUrl, text = "PicSellArt", { opacity = 0.22, font = "16px sans-serif", gap = 120 } = {}) {
  const img = await loadImage(imageUrl);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Create a pattern canvas for the watermark tile
  const tile = document.createElement("canvas");
  const tctx = tile.getContext("2d");
  tile.width = gap;
  tile.height = gap;

  tctx.clearRect(0, 0, tile.width, tile.height);
  tctx.save();
  tctx.translate(tile.width / 2, tile.height / 2);
  tctx.rotate((-30 * Math.PI) / 180);
  tctx.globalAlpha = opacity;
  tctx.font = font;
  tctx.textAlign = "center";
  tctx.fillStyle = "#000";
  tctx.fillText(text, 0, 0);
  tctx.restore();

  // Fill the main canvas with the watermark pattern
  const pattern = ctx.createPattern(tile, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", 0.9);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
}
