// src/utils/storage.js
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { buildImageRecord } from "./exploreData";

/**
 * Fetch all images from Firebase Storage (/public/images/).
 */
export async function fetchExploreImages() {
  try {
    const folderRef = ref(storage, "public/images");
    const listResult = await listAll(folderRef);

    const urlPromises = listResult.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return buildImageRecord({
        name: itemRef.name,
        url,
      });
    });

    return await Promise.all(urlPromises);
  } catch (err) {
    console.error("Error loading storage images:", err);
    return [];
  }
}
