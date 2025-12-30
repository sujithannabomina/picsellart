// src/pages/SellerUpload.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db, storage } from "../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, getDocs, query, where, orderBy } from "firebase/firestore";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const SellerUpload = () => {
  const { user } = useAuth();
  const uid = user?.uid;

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!uid) return;

      setLoading(true);
      setErr("");

      try {
        const snap = await getDoc(doc(db, "sellers", uid));
        if (!snap.exists() || !snap.data()?.planId) {
          setSeller(null);
          setLoading(false);
          return;
        }

        if (!alive) return;
        setSeller(snap.data());

        // load listings
        const q = query(
          collection(db, "listings"),
          where("sellerUid", "==", uid),
          orderBy("createdAt", "desc")
        );
        const ls = await getDocs(q);
        if (!alive) return;
        setMyListings(ls.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        if (!alive) return;
        setSeller(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [uid]);

  const maxPrice = useMemo(() => Number(seller?.maxPrice || 0), [seller]);
  const maxUploads = useMemo(() => Number(seller?.maxUploads || 0), [seller]);

  const canUploadMore = myListings.length < maxUploads;

  const onUpload = async () => {
    setErr("");

    if (!seller) {
      setErr("Please choose a plan first from Seller Dashboard.");
      return;
    }
    if (!canUploadMore) {
      setErr(`Upload limit reached (${maxUploads}).`);
      return;
    }
    if (!file) {
      setErr("Please select an image file.");
      return;
    }
    const p = Number(price);
    if (!title.trim()) {
      setErr("Please enter a title.");
      return;
    }
    if (!p || p <= 0) {
      setErr("Please enter a valid price.");
      return;
    }
    if (p > maxPrice) {
      setErr(`Price exceeds your plan max (₹${maxPrice}).`);
      return;
    }

    setSaving(true);
    try {
      // Flat path so Explore can show fast + easy
      const safeName = file.name.replace(/\s+/g, "_");
      const storagePath = `marketplace/${uid}__${Date.now()}__${safeName}`;

      const uploadRef = sRef(storage, storagePath);
      await uploadBytes(uploadRef, file);

      const url = await getDownloadURL(uploadRef);

      const docRef = await addDoc(collection(db, "listings"), {
        sellerUid: uid,
        sellerName: user?.displayName || "",
        title: title.trim(),
        price: p,
        url,
        storagePath,
        filename: safeName,
        status: "active",
        createdAt: serverTimestamp(),
      });

      // refresh list
      setMyListings((prev) => [
        { id: docRef.id, sellerUid: uid, title: title.trim(), price: p, url, storagePath, filename: safeName, status: "active" },
        ...prev,
      ]);

      setFile(null);
      setTitle("");
      setPrice("");
    } catch (e) {
      setErr("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card">Loading…</div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="page">
        <div className="card">
          <h1>Upload Images</h1>
          <p style={{ color: "#6b7280" }}>
            You don’t have an active plan yet. Please go to Seller Dashboard and choose a plan first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Upload Images</h1>
        <p style={{ color: "#6b7280" }}>
          Plan: <b>{seller.planName}</b> • Max uploads: <b>{maxUploads}</b> • Max price per image: <b>₹{maxPrice}</b>
        </p>

        <div style={{ marginTop: 14, display: "grid", gap: 10, maxWidth: 520 }}>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <input
            className="explore-search-input"
            placeholder="Title (e.g., Hyderabad Street Market)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="explore-search-input"
            placeholder={`Price (₹) — max ₹${maxPrice}`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button className="btn btn-nav-primary" disabled={saving || !canUploadMore} onClick={onUpload}>
            {saving ? "Uploading..." : canUploadMore ? "Upload to Marketplace" : "Upload Limit Reached"}
          </button>

          {err ? <div style={{ color: "#dc2626", fontWeight: 600 }}>{err}</div> : null}
        </div>

        <div style={{ marginTop: 18 }}>
          <h3>Your Listings</h3>
          {myListings.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No uploads yet.</p>
          ) : (
            <div className="image-grid">
              {myListings.map((it) => (
                <div className="image-card" key={it.id}>
                  <img src={it.url} alt={it.title} loading="lazy" />
                  <div className="image-card-body">
                    <div className="image-card-title">{it.title}</div>
                    <div style={{ marginTop: 6, fontWeight: 700 }}>₹{it.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerUpload;
