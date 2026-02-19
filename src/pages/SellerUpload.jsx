// FILE PATH: src/pages/SellerUpload.jsx
// ✅ COMPETITIVE VERSION - Category selection, multiple tags, quality checks

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db, storage } from "../firebase";
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getPlan } from "../utils/plans";

// ✅ Same categories as Explore
const CATEGORIES = [
  { id: "nature", label: "Nature" },
  { id: "business", label: "Business" },
  { id: "people", label: "People" },
  { id: "technology", label: "Technology" },
  { id: "food", label: "Food" },
  { id: "travel", label: "Travel" },
  { id: "abstract", label: "Abstract" },
  { id: "architecture", label: "Architecture" },
  { id: "animals", label: "Animals" },
  { id: "fashion", label: "Fashion" },
  { id: "sports", label: "Sports" },
];

export default function SellerUpload() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [seller, setSeller] = useState(null);
  const [uploadsCount, setUploadsCount] = useState(0);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Enhanced form fields
  const [title, setTitle] = useState("");
  const [priceINR, setPriceINR] = useState("");
  const [category, setCategory] = useState("nature");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user) return;

      const sSnap = await getDoc(doc(db, "sellers", user.uid));
      if (!sSnap.exists()) return;

      const sellerData = sSnap.data();
      if (cancelled) return;
      setSeller(sellerData);

      const itemsSnap = await getDocs(
        query(collection(db, "items"), where("uploadedBy", "==", user.uid))
      );
      if (!cancelled) setUploadsCount(itemsSnap.size);
    }

    run();
    return () => (cancelled = true);
  }, [user]);

  const plan = useMemo(() => getPlan(seller?.planId), [seller?.planId]);

  // ✅ File preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // ✅ Quality checks
  const validateImage = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // ✅ Minimum resolution: 1920x1080 (Full HD)
        if (img.width < 1920 || img.height < 1080) {
          reject(new Error(`Image resolution too low. Minimum: 1920x1080. Yours: ${img.width}x${img.height}`));
        }
        
        // ✅ Maximum file size: 10MB
        if (file.size > 10 * 1024 * 1024) {
          reject(new Error("File size too large. Maximum: 10MB"));
        }
        
        resolve(true);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Invalid image file"));
      };
      
      img.src = url;
    });
  };

  const onUpload = async () => {
    setErr("");
    setBusy(true);
    try {
      if (!user) throw new Error("Not logged in");
      if (!seller || seller.status !== "active")
        throw new Error("Seller account is not active.");
      if (!plan) throw new Error("Plan not found.");

      const price = Number(priceINR);
      if (!title.trim()) throw new Error("Title is required.");
      if (!file) throw new Error("Please select an image.");
      if (!Number.isFinite(price) || price <= 0)
        throw new Error("Invalid price.");
      if (price > plan.maxPriceINR)
        throw new Error(`Price cannot exceed ₹${plan.maxPriceINR}.`);
      if (uploadsCount >= plan.maxUploads)
        throw new Error("Upload limit reached for your account.");

      // ✅ Quality validation
      await validateImage(file);

      const safeName = file.name.replace(/\s+/g, "_");
      const storagePath = `sellers/${user.uid}/images/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // ✅ Parse tags
      const tagList = tags
        .split(",")
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

      // ✅ Create item with full metadata
      const itemId = `sellers-${user.uid}-${Date.now()}-${safeName}`;

      await setDoc(doc(db, "items", itemId), {
        // Basic info
        fileName: safeName,
        displayName: title.trim(),
        storagePath,
        price: price,
        downloadUrl: url,

        // ✅ NEW: Category & tags
        category: category,
        tags: tagList,

        // Seller info
        uploadedBy: user.uid,
        sellerName: user.displayName || seller.name || "",
        type: "seller",
        visibility: "public",

        // Stats
        views: 0,
        downloads: 0,

        // Metadata
        fileSize: file.size,
        createdAt: serverTimestamp(),
      });

      nav("/seller-dashboard", { replace: true });
    } catch (e) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Upload Photo</h1>
        <p className="mt-2 text-slate-600">
          Add a new listing. Quality guidelines: Min 1920x1080, Max 10MB.
        </p>

        {err ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="grid gap-6">
            {/* ✅ Image Preview */}
            {previewUrl && (
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-sm font-medium text-slate-700">Preview:</p>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            )}

            {/* ✅ File Input */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Image File *
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Requirements: 1920x1080 minimum, under 10MB, JPG/PNG format
              </p>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
              />
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Title *
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Mumbai Skyline at Sunset"
                maxLength={100}
              />
              <p className="text-xs text-slate-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* ✅ Category Dropdown */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Category *
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Tags Input */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Tags
              </label>
              <p className="text-xs text-slate-500 mt-1">
                Comma-separated keywords (e.g., sunset, cityscape, urban)
              </p>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="sunset, city, landscape, evening"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Price (INR) — max ₹{plan?.maxPriceINR} *
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={priceINR}
                onChange={(e) => setPriceINR(e.target.value)}
                placeholder="Example: 149"
                inputMode="numeric"
              />
              <p className="text-xs text-slate-500 mt-1">
                You earn 80% (₹{priceINR ? Math.round(priceINR * 0.8) : 0}), Platform fee: 20%
              </p>
            </div>

            {/* Upload Button */}
            <button
              disabled={busy}
              onClick={onUpload}
              className="mt-2 w-full rounded-2xl bg-black px-5 py-3 text-white hover:bg-slate-900 disabled:opacity-60"
            >
              {busy ? "Uploading..." : "Upload Photo"}
            </button>

            {/* Stats */}
            <div className="text-xs text-slate-500">
              Current uploads: {uploadsCount} / {plan?.maxUploads}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
