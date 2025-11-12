import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { buildImageRecord } from "./exploreData";

/**
 * List all files directly under a given folder in Firebase Storage.
 * @param {string} folder - e.g. "public" or "Buyer"
 * @param {("curated"|"seller")} source
 */
async function listFolder(folder, source) {
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);

  // We only care about files (result.items). If you later add subfolders,
  // you can recurse into result.prefixes.
  const records = await Promise.all(
    result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return buildImageRecord({
        path: itemRef.fullPath,
        url,
        source,
      });
    })
  );

  return records;
}

/**
 * Fetch all explore images from both:
 *  - "public/"   (your curated explore images)
 *  - "Buyer/"    (seller-uploaded images that should also appear)
 */
export async function fetchAllExploreImages() {
  const [publicImages, buyerImages] = await Promise.all([
    listFolder("public", "curated"),
    listFolder("Buyer", "seller"),
  ]);

  const all = [...publicImages, ...buyerImages];

  // Stable sort by name so the grid order is predictable
  all.sort((a, b) => a.name.localeCompare(b.name));

  return all;
}

/**
 * Filter + paginate a list of image records.
 *
 * @param {Array} allImages - full list
 * @param {Object} opts
 * @param {string} opts.searchTerm
 * @param {number} opts.page
 * @param {number} opts.pageSize
 *
 * @returns {{ items, totalItems, totalPages, page }}
 */
export function filterAndPaginate(allImages, opts = {}) {
  const {
    searchTerm = "",
    page = 1,
    pageSize = 18,
  } = opts;

  const q = searchTerm.trim().toLowerCase();
  const filtered = q
    ? allImages.filter((img) =>
        img.name.toLowerCase().includes(q)
      )
    : allImages;

  const totalItems = filtered.length;
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);

  return { items, totalItems, totalPages, page: safePage };
}

/**
 * Find a single curated (public) image by its filename.
 * Used by PhotoDetails page.
 *
 * @param {string} name - filename, e.g. "myphoto.jpg"
 * @returns {Promise<object|null>}
 */
export async function getPublicImageByName(name) {
  if (!name) return null;

  const folderRef = ref(storage, "public");
  const result = await listAll(folderRef);

  const matchRef = result.items.find((item) => item.name === name);
  if (!matchRef) {
    return null;
  }

  const url = await getDownloadURL(matchRef);

  return buildImageRecord({
    path: matchRef.fullPath,
    url,
    source: "curated",
  });
}
