// FILE PATH: src/pages/ViewPhoto.jsx
// ✅ COMPLETE FIX: Works with sample photos AND seller-uploaded photos

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import WatermarkedImage from "../components/WatermarkedImage";

function safeDecode(value, times = 2) {
  let v = value;
  for (let i = 0; i < times; i++) {
    try {
      const decoded = decodeURIComponent(v);
      if (decoded === v) break;
      v = decoded;
    } catch {
      break;
    }
  }
  return v;
}

export default function ViewPhoto() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const decodedId = useMemo(() => safeDecode(id || "", 3), [id]);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!decodedId) {
        setErr("Invalid photo.");
        setLoading(false);
        return;
      }

      setErr("");
      setLoading(true);

      try {
        console.log("🔍 Loading photo:", decodedId);

        // ✅ STRATEGY 1: Check if it's a Firestore item ID (seller photos)
        // Seller photo IDs look like: "sellers-HAATP6OP8SZcKvqPoLsofCrsv13-1740226200123-IMG_20250219_123619.jpg"
        if (decodedId.startsWith("sellers-") || decodedId.includes("items-")) {
          try {
            console.log("📦 Trying Firestore items collection...");
            const itemRef = doc(db, "items", decodedId);
            const itemSnap = await getDoc(itemRef);

            if (itemSnap.exists()) {
              const data = itemSnap.data();
              console.log("✅ Found in Firestore:", data);
              if (alive) {
                setItemData(data);
                setUrl(data.downloadUrl || "");
                setLoading(false);
              }
              return;
            }
          } catch (firestoreErr) {
            console.log("⚠️ Not in Firestore, trying storage...", firestoreErr);
          }
        }

        // ✅ STRATEGY 2: Try as Firebase Storage path (sample photos)
        let storagePath = "";

        if (decodedId.startsWith("sample-")) {
          // Format: "sample-public%2Fimages%2Fsample38.jpg"
          const raw = decodedId.replace("sample-", "");
          storagePath = safeDecode(raw, 3);
          console.log("📁 Sample photo path:", storagePath);
        } else if (decodedId.endsWith(".jpg") || decodedId.endsWith(".png") || decodedId.endsWith(".jpeg")) {
          // Format: "sample38.jpg"
          storagePath = `public/images/${decodedId}`;
          console.log("📁 Direct filename path:", storagePath);
        } else {
          // Format: "public/images/sample38.jpg"
          storagePath = decodedId;
          console.log("📁 Full path:", storagePath);
        }

        console.log("🔍 Fetching from Storage:", storagePath);
        const storageUrl = await getDownloadURL(ref(storage, storagePath));
        console.log("✅ Got Storage URL");
        
        if (alive) {
          setUrl(storageUrl);
          setLoading(false);
        }
      } catch (e) {
        console.error("❌ Error loading photo:", e);
        if (alive) {
          setErr("Unable to load this photo.");
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [decodedId]);

  const buyUrl = useMemo(() => {
    // ✅ If we have item data from Firestore (seller photo)
    if (itemData) {
      const price = itemData.price || 199;
      return `/checkout?type=seller&id=${encodeURIComponent(decodedId)}&amount=${price}`;
    }

    // ✅ Otherwise, it's a sample photo
    const sampleId = decodedId.startsWith("sample-")
      ? decodedId
      : `sample-${encodeURIComponent(decodedId)}`;
    return `/checkout?type=sample&id=${encodeURIComponent(sampleId)}`;
  }, [decodedId, itemData]);

  const onBuy = () => {
    if (user) navigate(buyUrl);
    else navigate("/buyer-login", { state: { next: buyUrl } });
  };

  return (
    <div className="psa-container">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="psa-title">
            {itemData?.displayName || "Photo Preview"}
          </h1>
          <p className="psa-subtitle mt-1">
            {itemData 
              ? `By ${itemData.sellerName || "Seller"} • ₹${itemData.price}` 
              : "Watermarked preview shown below."}
          </p>
        </div>
        <button className="psa-btn-soft" onClick={() => navigate("/explore")}>
          Back to Explore
        </button>
      </div>

      <div className="psa-card p-4 sm:p-6">
        {loading ? (
          <div className="w-full aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse" />
        ) : err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : (
          <WatermarkedImage src={url} alt="Preview" className="w-full aspect-[4/3]" />
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            To download the full file, purchase this photo.
          </div>
          <div className="flex gap-2">
            <button className="psa-btn-primary" onClick={onBuy}>
              Buy {itemData ? `(₹${itemData.price})` : ""}
            </button>
            <button className="psa-btn-soft" onClick={() => navigate("/explore")}>
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}