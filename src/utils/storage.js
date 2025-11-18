// src/utils/storage.js
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// Folders that should appear on the Explore page
const PUBLIC_FOLDERS = ["public", "Buyer"];

// Simple helper to generate a price pattern that looks nice
function derivePrice(index) {
  const priceCycle = [399, 499, 599, 799];
  return priceCycle[index % priceCycle.length];
}

/**
 * Load all images that should show on Explore.
 * - Reads from /public and /Buyer in Firebase Storage
 * - Returns nice objects for cards + view page
 */
export async function getExplorePhotos() {
  const allPhotos = [];
  let index = 0;

  for (const folder of PUBLIC_FOLDERS) {
    try {
      const folderRef = ref(storage, `${folder}/`);
      const res = await listAll(folderRef);

      for (const itemRef of res.items) {
        const downloadUrl = await getDownloadURL(itemRef);
        const fileName = itemRef.name;
        const storagePath = itemRef.fullPath;

        const price = derivePrice(index);

        allPhotos.push({
          // Encoded path used in URL
          id: encodeURIComponent(storagePath),
          storagePath,
          title: "Street Photography",
          fileName,
          price,
          previewUrl: downloadUrl,
        });

        index += 1;
      }
    } catch (err) {
      console.error(`Error listing folder "${folder}"`, err);
    }
  }

  // Remove duplicates (in case the same file exists in both folders)
  const uniqueMap = new Map();
  for (const photo of allPhotos) {
    if (!uniqueMap.has(photo.storagePath)) {
      uniqueMap.set(photo.storagePath, photo);
    }
  }

  const uniquePhotos = Array.from(uniqueMap.values());

  // Sort nicely by filename (sample1, sample2, ..., sample112)
  uniquePhotos.sort((a, b) =>
    a.fileName.localeCompare(b.fileName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  return uniquePhotos;
}
