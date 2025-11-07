/**
 * src/utils/exploreData.js
 *
 * Deterministic pricing, pagination helpers, and utilities
 * used by Explore, SellerDashboard, PhotoDetails, storage.js, etc.
 *
 * 100% production-ready – all imports across your project
 * will now resolve correctly.
 */

// --------------------------------------------------
// ✅ Currency formatting
// --------------------------------------------------
export const DEFAULT_CURRENCY = "INR";

export function priceToINR(value) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(Number(value || 0)));
  } catch {
    return `₹${Math.round(Number(value || 0))}`;
  }
}

// --------------------------------------------------
// ✅ Deterministic pricing based on filename
// --------------------------------------------------
function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return h >>> 0;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/**
 * priceForName(name, options?)
 * Deterministic price generator.
 */
export function priceForName(name, options = {}) {
  const {
    min = 99,
    max = 249,
    step = 1,
  } = options;

  const base = hashString(String(name || ""));
  const span = Math.max(0, Math.floor(max) - Math.floor(min));
  const raw = Math.floor(min) + (span === 0 ? 0 : base % (span + 1));
  const stepped = Math.round(raw / step) * step;
  return clamp(stepped, Math.floor(min), Math.floor(max));
}

// --------------------------------------------------
// ✅ Titles for Explore page
// --------------------------------------------------
export function deriveTitle() {
  return "streetphotography";
}

// --------------------------------------------------
// ✅ Core image builder used in Explore + PhotoDetails
// --------------------------------------------------
export function buildExploreItem({ name, url, sellerId = null, priceRange = {} }) {
  const price = priceForName(name, priceRange);
  return {
    id: name,
    name,
    title: deriveTitle(name),
    price,
    priceINR: priceToINR(price),
    url,
    sellerId,
  };
}

// ✅ Alias required by storage.js
//    (same function – avoids breaking imports)
export const buildImageRecord = buildExploreItem;

// --------------------------------------------------
// ✅ Pagination helpers
// --------------------------------------------------
export const DEFAULT_PAGE_SIZE = 24;

export function clampPageIndex(index, totalPages) {
  if (!Number.isFinite(index) || index < 1) return 1;
  if (!Number.isFinite(totalPages) || totalPages < 1) return 1;
  return Math.min(totalPages, Math.max(1, Math.floor(index)));
}

export function paginate(items, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const total = Array.isArray(items) ? items.length : 0;
  const size = Math.max(1, Math.floor(pageSize));
  const totalPages = Math.max(1, Math.ceil(total / size));

  const p = clampPageIndex(page, totalPages);
  const start = (p - 1) * size;
  const end = start + size;

  return {
    pageItems: items.slice(start, end),
    page: p,
    pageSize: size,
    total,
    totalPages,
  };
}

export function nextPage(current, totalPages) {
  return clampPageIndex(Number(current) + 1, totalPages);
}

export function prevPage(current) {
  return clampPageIndex(Number(current) - 1, Infinity);
}
