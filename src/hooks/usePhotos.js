// src/hooks/usePhotos.js
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebase";

/**
 * Loads all photos (sample + seller) from Firestore + Storage.
 * Assumes a "photos" collection where each document has at least:
 * - storagePath: path inside Storage, e.g. "public/sample1.jpg" or "Buyer/uid/file.jpg"
 * - title (optional)
 * - filename (optional)
 * - price (optional)
 * - ownerType or type: "sample" or "seller" (used by your Cloud Functions)
 */
export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const docs = snapshot.docs;

          const items = await Promise.all(
            docs.map(async (doc) => {
              const data = doc.data();

              // 1. Build image URL
              let imageUrl = data.thumbnailUrl || null;
              if (!imageUrl && data.storagePath) {
                const storageRef = ref(storage, data.storagePath);
                imageUrl = await getDownloadURL(storageRef);
              }

              // 2. Infer filename
              const filename =
                data.filename ||
                (data.storagePath
                  ? data.storagePath.split("/").slice(-1)[0]
                  : "");

              // 3. Owner type – used by backend to route money
              const ownerType =
                data.ownerType ||
                data.type ||
                (data.storagePath && data.storagePath.startsWith("public/")
                  ? "sample"
                  : "seller");

              return {
                id: doc.id,
                title: data.title || data.name || "Street Photography",
                filename,
                price: data.price || 199,
                ownerType,
                imageUrl,
              };
            })
          );

          setPhotos(items);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error("Error building photo list:", err);
          setError("Failed to load images.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setError("Failed to load images.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { photos, loading, error };
}
