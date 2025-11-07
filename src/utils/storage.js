// src/utils/storage.js
import { storage } from "../firebase";
import { listAll, ref, getDownloadURL, getMetadata } from "firebase/storage";

/* --------------------------- helpers --------------------------- */

function seededPriceFromName(name, min = 149, max = 249) {
  // Deterministic "random" price based on filename
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const n = min + (h % (max - min + 1));
  return n;
}

async function toImageItem(itemRef) {
  const url = await getDownloadURL(itemRef);

  // Prefer custom metadata price; else derive from filename
  let price = seededPriceFromName(itemRef.name);
  try {
    const md = await getMetadata(itemRef);
    const metaPrice = Number(md?.customMetadata?.price);
    if (!Number.isNaN(metaPrice)) price = metaPrice;
  } catch {
    /* keep derived price */
  }

  return {
    id: itemRef.fullPath,   // unique key
    name: itemRef.name,
    url,
    price,
    path: itemRef.fullPath, // needed by API for secure download
  };
}

async function listFlatFolder(path) {
  const r = ref(storage, path);
  const out = [];
  try {
    const res = await listAll(r);
    for (const item of res.items) out.push(await toImageItem(item));
  } catch {
    // folder might not exist yet
  }
  return out;
}

// sellers/*/images  (optional auto-inclusion of seller uploads)
async function listAllSellerImages() {
  const out = [];
  try {
    const sellersRoot = await listAll(ref(storage, "sellers"));
    for (const sellerFolder of sellersRoot.prefixes) {
      const imagesRef = ref(storage, `${sellerFolder.fullPath}/images`);
      try {
        const res = await listAll(imagesRef);
        for (const item of res.items) out.push(await toImageItem(item));
      } catch {
        /* seller has no images folder yet */
      }
    }
  } catch {
    /* no sellers root yet */
  }
  return out;
}

/* --------------------------- public API --------------------------- */
/**
 * Returns ALL explore images from Firebase Storage ONLY.
 * Sources:
 *   - gs://.../public/
 *   - gs://.../Buyer/
 *   - gs://.../sellers/<uid>/images
 */
export async function fetchAllExploreImages() {
  const [fromPublic, fromBuyer, fromSellers] = await Promise.all([
    listFlatFolder("public"),
    listFlatFolder("Buyer"),
    listAllSellerImages(),
  ]);

  const all = [...fromPublic, ...fromBuyer, ...fromSellers];

  // De-dupe by fullPath
  const seen = new Set();
  const uniq = [];
  for (const itm of all) {
    if (seen.has(itm.id)) continue;
    seen.add(itm.id);
    uniq.push(itm);
  }

  // Stable order for UX
  uniq.sort((a, b) => a.name.localeCompare(b.name));
  return uniq;
}

export function filterAndPaginate(items, { q = "", page = 1, pageSize = 24 } = {}) {
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? items.filter((x) => x.name.toLowerCase().includes(needle))
    : items;

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return { total, page, pageSize, items: pageItems };
}
