// src/utils/storage.js
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// Folders to scan in Storage
const BUYER_FOLDER = "Buyer";
const PUBLIC_FOLDER = "public";

// Simple price generator so your prices look like 399/499/599/799
function getPriceForIndex(index) {
  const prices = [399, 499, 599, 799];
  return prices[index % prices.length];
}

/**
 * Fetch a lightweight index of all photos from Firebase Storage.
 * Returns: [{ id, title, fileName, storagePath, price }]
 * NOTE: no download URLs here – keeps it fast.
 */
export async function fetchPhotoIndex() {
  const buyerRef = ref(storage, BUYER_FOLDER);
  const publicRef = ref(storage, PUBLIC_FOLDER);

  const [buyerList, publicList] = await Promise.all([
    listAll(buyerRef),
    listAll(publicRef),
  ]);

  const allItems = [
    ...buyerList.items.map((item) => ({
      fullPath: item.fullPath,
      name: item.name,
    })),
    ...publicList.items.map((item) => ({
      fullPath: item.fullPath,
      name: item.name,
    })),
  ];

  // Sort for consistent order (by filename)
  allItems.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));

  const indexed = allItems.map((item, idx) => ({
    id: item.fullPath,
    title: "Street Photography",
    fileName: item.name,
    storagePath: item.fullPath,
    price: getPriceForIndex(idx),
  }));

  return indexed;
}

/**
 * Get a download URL for a given storage path.
 * Used only for images on the current page.
 */
export async function fetchPhotoUrl(storagePath) {
  const imageRef = ref(storage, storagePath);
  return getDownloadURL(imageRef);
}
