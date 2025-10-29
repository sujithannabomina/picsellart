// src/utils/watermark.js
// Production-ready browser watermark utility.
// Exports a named `watermark` used by PhotoDetail.jsx.
// Works with image URLs, <img>, File/Blob. Supports text or logo, single or tiled diagonal pattern.

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

/** Load an image from URL/Blob/<img>. Ensures CORS safety for canvas export. */
async function loadImage(source) {
  if (!isBrowser()) throw new Error("watermark(): must run in the browser.");

  // If already an HTMLImageElement and complete, use it as-is.
  if (source instanceof HTMLImageElement) {
    if (source.complete && source.naturalWidth > 0) return source;
    await new Promise((res, rej) => {
      source.onload = () => res();
      source.onerror = rej;
    });
    return source;
  }

  // If File/Blob, create object URL.
  let url = source;
  let revoke = null;
  if (source instanceof Blob) {
    url = URL.createObjectURL(source);
    revoke = () => URL.revokeObjectURL(url);
  }

  const img = new Image();
  // Important: CORS so we can export the canvas
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  const done = new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error("Failed to load image for watermark."));
  });
  img.src = url;
  try {
    return await done;
  } finally {
    if (revoke) revoke();
  }
}

/**
 * Draw tiled diagonal watermark text.
 * @returns {void}
 */
function drawTiledText(ctx, text, {
  angleDeg = -30,
  gap = 220,
  font = "600 24px Inter, system-ui, sans-serif",
  fillStyle = "rgba(255,255,255,0.22)",
  shadowColor = "rgba(0,0,0,0.25)",
  shadowBlur = 2,
} = {}) {
  const { width, height } = ctx.canvas;

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);

  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;

  // Compute grid dims after rotation transform
  const diag = Math.hypot(width, height);
  const cols = Math.ceil((width + diag) / gap) + 1;
  const rows = Math.ceil((height + diag) / gap) + 1;

  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const x = (c * gap);
      const y = (r * gap);
      ctx.fillText(text, x, y);
    }
  }
  ctx.restore();
}

/** Draw a single logo image watermark. */
async function drawLogo(ctx, urlOrImg, {
  widthRatio = 0.18, // fraction of base image width
  opacity = 0.65,
  position = "bottom-right", // 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  margin = 16,
} = {}) {
  const logo = urlOrImg instanceof HTMLImageElement ? urlOrImg : await loadImage(urlOrImg);
  const baseW = ctx.canvas.width;
  const targetW = Math.max(48, Math.round(baseW * widthRatio));
  const scale = targetW / logo.naturalWidth;
  const targetH = Math.round(logo.naturalHeight * scale);

  let x = margin, y = margin;
  if (position.includes("right")) x = ctx.canvas.width - targetW - margin;
  if (position.includes("bottom")) y = ctx.canvas.height - targetH - margin;
  if (position === "center") {
    x = (ctx.canvas.width - targetW) / 2;
    y = (ctx.canvas.height - targetH) / 2;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(logo, x, y, targetW, targetH);
  ctx.restore();
}

/**
 * Main API: Apply watermark to an image and return { dataUrl, blob }.
 *
 * @param {string|HTMLImageElement|Blob} source - Image URL, <img>, or File/Blob.
 * @param {{
 *   text?: string,                    // Watermark text, if provided
 *   tile?: boolean,                   // Tile diagonal pattern (default true if text supplied)
 *   angleDeg?: number,                // Tile angle
 *   gap?: number,                     // Tile gap (px)
 *   font?: string,                    // CSS font for text watermark
 *   color?: string,                   // Text fill style (rgba)
 *   shadowColor?: string,             // Text shadow color
 *   shadowBlur?: number,              // Text shadow blur
 *   logoUrl?: string|HTMLImageElement,// Optional logo watermark
 *   logoPosition?: string,            // Position for logo watermark
 *   logoOpacity?: number,             // Logo opacity
 *   logoWidthRatio?: number,          // Logo width fraction
 *   mimeType?: string,                // Output mime type (default image/jpeg)
 *   quality?: number                  // 0..1 for jpeg/webp
 * }} options
 * @returns {Promise<{dataUrl: string, blob: Blob}>}
 */
export async function watermark(source, options = {}) {
  if (!isBrowser()) throw new Error("watermark(): must run in the browser.");

  const {
    text = "",
    tile = text ? true : false,
    angleDeg = -30,
    gap = 220,
    font = "600 24px Inter, system-ui, sans-serif",
    color = "rgba(255,255,255,0.22)",
    shadowColor = "rgba(0,0,0,0.25)",
    shadowBlur = 2,

    logoUrl,
    logoPosition = "bottom-right",
    logoOpacity = 0.65,
    logoWidthRatio = 0.18,

    mimeType = "image/jpeg",
    quality = 0.9,
  } = options;

  const img = await loadImage(source);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");

  // Draw base image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Draw text watermark
  if (text) {
    drawTiledText(ctx, text, {
      angleDeg,
      gap,
      font,
      fillStyle: color,
      shadowColor,
      shadowBlur,
    });
  }

  // Draw logo watermark
  if (logoUrl) {
    await drawLogo(ctx, logoUrl, {
      position: logoPosition,
      opacity: logoOpacity,
      widthRatio: logoWidthRatio,
    });
  }

  // Export
  const dataUrl = canvas.toDataURL(mimeType, quality);
  const blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b), mimeType, quality)
  );

  return { dataUrl, blob };
}

export default watermark;

// Optional helper exports for advanced use
export { drawTiledText, drawLogo };
