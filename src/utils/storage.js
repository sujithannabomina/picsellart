// src/utils/storage.js
// Utilities for Explore page image listing

import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

/**
 * 1) SAMPLE IMAGES FROM /public/images
 *
 * Vite copies everything in /public to the root of the site.
 * `import.meta.glob("/images/*")` will pick up:
 *   public/images/sample1.jpg, sample2.jpg, ...
 */
const sampleModules = import.meta.glob("/images/*.{jpg,jpeg,png}", {
  eager: true,
  as: "url",
});

const sampleData = Object.entries(sampleModules).map(([path, url], index) => {
  const fileName = path.split("/").pop() || `sample-${index + 1}.jpg`;

  return {
    id: `sample-${fileName}`,    // unique ID for view route
    name: fileName,
    category: "Street Photography",
    price: 399,                  // base price – can adjust later
    watermarkedUrl: url,         // right now same file; watermark overlay is handled in UI
    thumbnailUrl: url,
    source: "sample",
  };
});

/**
 * 2) SELLER IMAGES FROM FIREBASE STORAGE
 *
 * We assume seller uploads go to Storage folder: "seller-images/"
 * (we can adjust this later if your path is different).
 */
async function fetchSellerImages() {
  try {
    const folderRef = ref(storage, "seller-images");
    const res = await listAll(folderRef);

    const items = await Promise.all(
      res.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const name = item.name;

        return {
          id: `seller-${name}`,
          name,
          category: "Seller Upload",
          price: 499,             // default; real price can come from Firestore later
          watermarkedUrl: url,
          thumbnailUrl: url,
          source: "seller",
        };
      })
    );

    return items;
  } catch (err) {
    console.error("Error fetching seller images from Storage:", err);
    return [];
  }
}

/**
 * Merge sample + seller images for Explore page.
 */
export async function fetchAllExploreImages() {
  const sellerImages = await fetchSellerImages();
  return [...sampleData, ...sellerImages];
}

/**
 * Find one image by ID (used on /view/:id page).
 */
export async function getExploreImageById(id) {
  const all = await fetchAllExploreImages();
  return all.find((img) => img.id === id);
}

/**
 * Filter + paginate helper for Explore grid.
 */
export function filterAndPaginate(list, page, search) {
  const pageSize = 12;

  let filtered = list;
  if (search && search.trim()) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (img) =>
        img.name.toLowerCase().includes(term) ||
        (img.category || "").toLowerCase().includes(term)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: filtered.slice(start, end),
    isLast: end >= filtered.length,
  };
}
