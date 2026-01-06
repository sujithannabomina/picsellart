// src/hooks/usePhotos.js
import { useEffect, useMemo, useState } from "react";
import { storage, db } from "../firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

function numericSortBySampleName(a, b) {
  // sample1.jpg ... sample112.jpg
  const ax = (a.match(/\d+/)?.[0] ?? "0") * 1;
  const bx = (b.match(/\d+/)?.[0] ?? "0") * 1;
  return ax - bx;
}

export default function usePhotos() {
  const [samplePhotos, setSamplePhotos] = useState([]);
  const [sellerPhotos, setSellerPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsub = null;

    async function loadSamples() {
      try {
        // ✅ Firebase Storage: public/images/
        const folderRef = ref(storage, "public/images");
        const res = await listAll(folderRef);

        const names = res.items.map((it) => it.name).sort(numericSortBySampleName);

        const urls = await Promise.all(
          names.map(async (name) => {
            const url = await getDownloadURL(ref(storage, `public/images/${name}`));
            return { name, url };
          })
        );

        // You can control sample pricing here (example: 121..232)
        const mapped = urls.map((x, idx) => ({
          id: `sample:${x.name}`,
          kind: "sample",
          title: "Street Photography",
          filename: x.name,
          imageUrl: x.url,
          price: 121 + (idx % 80),
          license: "Standard digital license",
        }));

        setSamplePhotos(mapped);
      } catch (e) {
        setError((prev) => prev || "Failed to load sample images from Firebase Storage.");
      }
    }

    function subscribeSellerListings() {
      try {
        // ✅ Firestore: listings (auto updates)
        // Expected doc fields:
        // title, price, previewUrl, filename, sellerId, sellerName, status, createdAt
        const q = query(
          collection(db, "listings"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        );

        unsub = onSnapshot(
          q,
          (snap) => {
            const items = snap.docs.map((d) => {
              const data = d.data();
              return {
                id: `seller:${d.id}`,
                kind: "seller",
                listingId: d.id,
                title: data.title || "Seller Photo",
                filename: data.filename || "seller-file",
                imageUrl: data.previewUrl || "", // IMPORTANT: store previewUrl at upload time
                price: Number(data.price || 199),
                license: "Standard digital license",
                sellerId: data.sellerId || "",
                sellerName: data.sellerName || "Seller",
              };
            });

            // Filter out broken listings with no previewUrl (prevents blank cards)
            setSellerPhotos(items.filter((x) => !!x.imageUrl));
          },
          () => {
            // If listings collection not ready, Explore still works with samples
          }
        );
      } catch (e) {
        // Ignore Firestore listing errors for now; samples still show
      }
    }

    (async () => {
      setLoading(true);
      setError("");
      await loadSamples();
      subscribeSellerListings();
      setLoading(false);
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const allPhotos = useMemo(() => {
    // Show seller photos first, then samples
    return [...sellerPhotos, ...samplePhotos];
  }, [sellerPhotos, samplePhotos]);

  return { photos: allPhotos, loading, error };
}
