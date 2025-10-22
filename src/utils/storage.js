// src/utils/storage.js
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const storage = getStorage(app);

/**
 * List one page (maxResults) from a given folder.
 * Returns { items: [{name, url, path}], nextPageToken }
 */
export async function listPage(folder, pageToken = undefined, maxResults = 24) {
  const r = ref(storage, folder);
  const res = await list(r, { maxResults, pageToken });
  const items = await Promise.all(
    res.items.map(async (i) => ({
      name: i.name,
      path: i.fullPath,
      url: await getDownloadURL(i),
    }))
  );
  return { items, nextPageToken: res.nextPageToken || null };
}

/**
 * Fetches one merged page from both "public/" and "Buyer/".
 * Keeps their next tokens separate so we can load more later.
 */
export async function listMerged(first = false, tokens = { public: null, buyer: null }) {
  const [pub, buy] = await Promise.all([
    listPage("public", tokens.public),
    listPage("Buyer", tokens.buyer),
  ]);

  // interleave-ish (simple concat also fine)
  const items = [...pub.items, ...buy.items];

  return {
    items,
    nextTokens: { public: pub.nextPageToken, buyer: buy.nextPageToken },
  };
}
