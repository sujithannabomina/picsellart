// src/utils/storage.js
import { getStorage, ref, list, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

/**
 * Fetch items from a storage folder with pagination.
 * @param {string} folder e.g. "public" or "Buyer"
 * @param {number} pageSize
 * @param {string|null} pageToken
 * @returns {Promise<{items: Array<{name,url}>, nextPageToken: string|null}>}
 */
export async function fetchStorageBatch(folder, pageSize=24, pageToken=null){
  const storage = getStorage(app);
  const r = ref(storage, folder);
  const { items, nextPageToken } = await list(r, { maxResults: pageSize, pageToken: pageToken || undefined });
  const urls = await Promise.all(items.map(i=> getDownloadURL(i)));
  const out = items.map((i,idx)=>({ name: i.name, url: urls[idx] }));
  return { items: out, nextPageToken: nextPageToken || null };
}

/**
 * Convenience: fetch both "public" and "Buyer" page in parallel, then merge.
 * We tag source so you can split later if needed.
 */
export async function fetchExplorePage({pageSize=24, tokenPublic=null, tokenBuyer=null}){
  const [a,b] = await Promise.all([
    fetchStorageBatch("public", pageSize, tokenPublic),
    fetchStorageBatch("Buyer",  pageSize, tokenBuyer),
  ]);

  // Merge, keep order alternating between folders for variety
  const merged = [];
  const maxLen = Math.max(a.items.length, b.items.length);
  for(let i=0;i<maxLen;i++){
    if(a.items[i]) merged.push({...a.items[i], source:"public"});
    if(b.items[i]) merged.push({...b.items[i], source:"Buyer"});
  }
  return {
    items: merged,
    next: { public: a.nextPageToken, buyer: b.nextPageToken }
  };
}
