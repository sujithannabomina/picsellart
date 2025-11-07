/**
 * src/utils/exploreData.js
 *
 * Deterministic pricing, pagination helpers, and small utilities
 * used by Explore, SellerDashboard, and PhotoDetails pages.
 *
 * All functions are side-effect free and safe for SSR/build.
 */

// ---- Currency formatting ----
export const DEFAULT_CURRENCY = "INR";

export function priceToINR(value) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(Number(value || 0)));
  } catch {
    // Fallback for very old runtimes (shouldn’t trigger on Node 20/22+)
    return `₹${Math.round(Number(value || 0))}`;
  }
}

// ---- Deterministic “random” pricing from a string (filename or path) ----
// djb2 hash (simple, fast, deterministic)
function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i); // h * 33 ^ char
  }
  // force unsigned 32-bit
  return h >>> 0;
}

/**
 * Clamp a number into [min, max].
 */
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * priceForName(name, options?)
 * - Produces a stable, deterministic price for a given filename/key.
 * - Default range aligns with your public explore pricing expectations.
 *
 * Options:
 *   - min: lower bound (inclusive) – default 99
 *   - max: upper bound (inclusive) – default 249
 *   - step: round to nearest step (e.g. 5) – default 1
 *
 * Notes:
 * - This respects your plans where max image price is typically ≤ ₹249.
 * - For seller images, you may override min/max based on their plan.
 */
export function priceForName(name, options = {}) {
  const {
    min = 99,
    max = 249,
    step = 1,
  } = options;

  const base = hashString(String(name || ""));
  // Map hash uniformly into [min, max]
  const span = Math.max(0, Math.floor(max) - Math.floor(min));
  const raw = Math.floor(min) + (span === 0 ? 0 : base % (span + 1));

  // snap to step
  const stepped = Math.round(raw / step) * step;
  return clamp(stepped, Math.floor(min), Math.floor(max));
}

// ---- Titles / labels ----

/**
 * deriveTitle(name)
 * For your requirement, title should be "streetphotography" regardless.
 * If you later want to infer from folder/keywords, extend here.
 */
export function deriveTitle(_name) {
  return "streetphotography";
}

/**
 * buildExploreItem({ name, url, sellerId?, priceRange? })
 * Normalizes an item for Explore grid.
 */
export function buildExploreItem({ name, url, sellerId = null, priceRange = {} }) {
  const price = priceForName(name, priceRange);
  return {
    id: name,                 // keep stable key
    name,                     // original filename or storage path
    title: deriveTitle(name), // "streetphotography"
    price,
    priceINR: priceToINR(price),
    url,                      // public (watermarked or preview) URL
    sellerId,
  };
}

// ---- Pagination helpers ----
export const DEFAULT_PAGE_SIZE = 24;

/**
 * clampPageIndex(index, totalPages)
 * Ensures page index stays within [1, totalPages] (1-based paging).
 */
export function clampPageIndex(index, totalPages) {
  if (!Number.isFinite(index) || index < 1) return 1;
  if (!Number.isFinite(totalPages) || totalPages < 1) return 1;
  return Math.min(totalPages, Math.max(1, Math.floor(index)));
}

/**
 * paginate(items, page = 1, pageSize = DEFAULT_PAGE_SIZE)
 * Returns { pageItems, page, pageSize, total, totalPages }
 */
export function paginate(items, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const total = Array.isArray(items) ? items.length : 0;
  const size = Math.max(1, Math.floor(pageSize || DEFAULT_PAGE_SIZE));
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safePage = clampPageIndex(page, totalPages);

  const start = (safePage - 1) * size;
  const end = start + size;

  return {
    pageItems: (items || []).slice(start, end),
    page: safePage,
    pageSize: size,
    total,
    totalPages,
  };
}

/**
 * nextPage(current, totalPages)
 */
export function nextPage(current, totalPages) {
  return clampPageIndex((Number(current) || 1) + 1, Number(totalPages) || 1);
}

/**
 * prevPage(current)
 */
export function prevPage(current) {
  return clampPageIndex((Number(current) || 1) - 1, Number.POSITIVE_INFINITY);
}
