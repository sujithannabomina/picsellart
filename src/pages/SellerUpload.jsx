// src/pages/SellerUpload.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db, storage } from "../firebase";
import { collection, doc, getDoc, getDocs, serverTimestamp, addDoc, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getPlan } from "../utils/plans";

export default function SellerUpload() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [seller, setSeller] = useState(null);
  const [uploadsCount, setUploadsCount] = useState(0);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [priceINR, setPriceINR] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user) return;
      const sSnap = await getDoc(doc(db, "sellers", user.uid));
      if (!sSnap.exists()) return;
      const sellerData = sSnap.data();
      if (cancelled) return;
      setSeller(sellerData);

      const photosSnap = await getDocs(query(collection(db, "photos"), where("sellerId", "==", user.uid)));
      if (!cancelled) setUploadsCount(photosSnap.size);
    }

    run();
    return () => (cancelled = true);
  }, [user]);

  const plan = useMemo(() => getPlan(seller?.planId), [seller?.planId]);

  const onUpload = async () => {
    setErr("");
    setBusy(true);
    try {
      if (!user) throw new Error("Not logged in");
      if (!seller || seller.status !== "active") throw new Error("Seller account is not active.");
      if (!plan) throw new Error("Plan not found.");

      const price = Number(priceINR);
      if (!title.trim()) throw new Error("Title is required.");
      if (!file) throw new Error("Please select an image.");
      if (!Number.isFinite(price) || price <= 0) throw new Error("Invalid price.");
      if (price > plan.maxPriceINR) throw new Error(`Price cannot exceed ₹${plan.maxPriceINR}.`);
      if (uploadsCount >= plan.maxUploads) throw new Error("Upload limit reached for your account.");

      const safeName = file.name.replace(/\s+/g, "_");
      const storagePath = `sellers/${user.uid}/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        sellerId: user.uid,
        title: title.trim(),
        priceINR: price,
        imageUrl: url,
        storagePath,
        createdAt: serverTimestamp(),
      });

      nav("/seller/dashboard", { replace: true });
    } catch (e) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Upload Photo</h1>
        <p className="mt-2 text-slate-600">
          Upload a new listing. Limits are enforced automatically.
        </p>

        {err ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Sunset Street Photography"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Price (INR) — max ₹{plan?.maxPriceINR}
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                value={priceINR}
                onChange={(e) => setPriceINR(e.target.value)}
                placeholder="Example: 149"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Image File</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <button
              disabled={busy}
              onClick={onUpload}
              className="mt-2 w-full rounded-2xl bg-black px-5 py-3 text-white hover:bg-slate-900 disabled:opacity-60"
            >
              {busy ? "Uploading..." : "Upload"}
            </button>

            <div className="text-xs text-slate-500">
              Current uploads: {uploadsCount} / {plan?.maxUploads}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
