// src/utils/watermark.js
// Kept for compatibility. If you later want to generate
// watermarked URLs in Cloud Functions, you can wire that here.

export const getWatermarkedUrl = (originalUrl) => {
  // For now we just use the original URL; the visual watermark
  // is applied by <WatermarkedImage /> with CSS overlay.
  return originalUrl;
};
