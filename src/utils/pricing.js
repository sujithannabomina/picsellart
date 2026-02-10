// FILE PATH: src/utils/pricing.js

// Deterministic hash -> stable “random-looking” price
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Your sample images must stay fixed forever.
// Range: 120–199 (change if you want)
export function getFixedPriceForImage(fileName) {
  const base = 120;
  const max = 199;
  const h = hashString(String(fileName || "").toLowerCase());
  return base + (h % (max - base + 1));
}

// Normalize weird sample path variants
export function normalizeStoragePath(raw) {
  const s = String(raw || "").replace(/^\/+/, "");
  if (!s) return "";
  if (s.startsWith("sample-public/")) return s.replace("sample-public/", "public/");
  return s;
}
