// Storage helpers for Explore (Firebase client SDK)
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

/**
 * Lists a page of images from Firebase Storage under "public/".
 * It tries "public/watermarked/<name>" first, falling back to "public/<name>"
 * and flags overlay=true so the component can add a client watermark.
 */
export async function listExplorePage({ pageSize = 24, pageToken = undefined } = {}) {
  const storage = getStorage(app);
  const baseRef = ref(storage, "public");

  const { items, nextPageToken } = await list(baseRef, { maxResults: pageSize, pageToken });

  const results = await Promise.all(items.map(async (itemRef) => {
    const name = itemRef.name; // e.g. sample42.jpg
    // Try server watermarked copy first
    let url, overlay = false;
    try {
      const wmRef = ref(storage, `public/watermarked/${name}`);
      url = await getDownloadURL(wmRef);
    } catch {
      // fallback to original + client overlay
      url = await getDownloadURL(itemRef);
      overlay = true;
    }

    // Simple deterministic price banding by filename number (keeps sample pricing varied)
    const match = name.match(/(\d+)/);
    const n = match ? parseInt(match[1], 10) : 0;
    const price = n % 5 === 0 ? 249 : n % 3 === 0 ? 149 : 99;

    return {
      id: name,
      title: "Street Photography",
      price,
      url,
      overlay, // if true, component will draw watermark overlay
    };
  }));

  return { items: results, nextPageToken };
}
