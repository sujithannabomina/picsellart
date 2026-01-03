// src/hooks/usePhotos.js
import { useEffect, useMemo, useState } from "react";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { storage, db } from "../firebase";

// 1) Loads sample images from Storage: public/images
// 2) Loads seller listings from Firestore: listings (recommended production approach)
// 3) DEDUPES results so laptop never shows double items

export default function usePhotos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const value = useMemo(() => ({ items, loading }), [items, loading]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const sample = await loadSampleImages().catch(() => []);
      const listings = await loadListings().catch(() => []);

      // merge + dedupe by stable key (storagePath or url)
      const merged = [...listings, ...sample];
      const map = new Map();
      for (const it of merged) {
        const key = it.storagePath || it.url || it.id;
        if (!key) continue;
        if (!map.has(key)) map.set(key, it);
      }

      const final = Array.from(map.values()).sort((a, b) => {
        const ta = a.createdAtMs || 0;
        const tb = b.createdAtMs || 0;
        return tb - ta;
      });

      if (alive) {
        setItems(final);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return value;
}

async function loadSampleImages() {
  const folder = ref(storage, "public/images");
  const res = await listAll(folder);

  const urls = await Promise.all(
    res.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const filename = itemRef.name;

      // sample pricing (stable + realistic)
      const base = hashNumber(filename);
      const price = 100 + (base % 150); // 100–249

      return {
        id: `sample_${filename}`,
        storagePath: itemRef.fullPath,
        url,
        filename,
        title: "Street Photography",
        price,
        source: "sample",
        createdAtMs: 1, // keep samples below listings
        license: "Standard digital license",
      };
    })
  );

  return urls;
}

async function loadListings() {
  // Firestore collection: listings
  // docs: { title, price, url, storagePath, sellerUid, createdAt, status }
  const q = query(
    collection(db, "listings"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() || {};
    return {
      id: d.id,
      storagePath: data.storagePath || `listing_${d.id}`,
      url: data.url,
      filename: data.filename || "",
      title: data.title || "Seller Upload",
      price: Number(data.price || 0),
      source: "seller",
      createdAtMs: data.createdAt?.toMillis?.() || Date.now(),
      license: "Standard digital license",
    };
  });
}

function hashNumber(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
