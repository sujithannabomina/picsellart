// src/utils/storage.js
import { storage } from "../firebase";
import { listAll, ref, getDownloadURL, getMetadata } from "firebase/storage";

/** ---------- helpers ---------- */
function seededPriceFromName(name, min = 149, max = 249) {
  // Deterministic "random" price from filename
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const n = min + (h % (max - min + 1));
  return n;
}

async function toImageItem(itemRef) {
  const url = await getDownloadURL(itemRef);

  // Prefer storage custom metadata -> price; else deterministic price from name
  let price = seededPriceFromName(itemRef.name);
  try {
    const md = await getMetadata(itemRef);
    if (md?.customMetadata?.price) {
      const n = Number(md.customMetadata.price);
      if (!Number.isNaN(n)) price = n;
    }
  } catch {
    /* ignore, keep seeded price */
  }

  return {
    id: itemRef.fullPath,
    name: itemRef.name,
    url,
    price,
    path: itemRef.fullPath,
  };
}

async function listFlatFolder(path) {
  const r = ref(storage, path);
  const out = [];
  const res = await listAll(r);
  for (const item of res.items) out.push(await toImageItem(item));
  return out;
}

/** sellers/**/images (optional for auto-inclusion) */
async function listAllSellerImages() {
  const root = ref(storage, "sellers");
  const out = [];
  try {
    const sellersRoot = await listAll(root);
    for (const sellerFolder of sellersRoot.prefixes) {
      const imagesRef = ref(storage, `${sellerFolder.fullPath}/images`);
      try {
        const res = await listAll(imagesRef);
        for (const item of res.items) out.push(await toImageItem(item));
      } catch {
        /* no images subfolder yet */
      }
    }
  } catch {
    /* no sellers root yet */
  }
  return out;
}

/** ---------- public API for Explore ---------- */
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
  // De-dupe by fullPath if same file appears in multiple folders
  const seen = new Set();
  const uniq = [];
  for (const itm of all) {
    if (seen.has(itm.id)) continue;
    seen.add(itm.id);
    uniq.push(itm);
  }
  // stable order
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
