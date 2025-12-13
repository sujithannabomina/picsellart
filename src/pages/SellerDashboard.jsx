// src/pages/SellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "../hooks/useAuth";

const PLANS = [
  { id: "starter", name: "Starter", price: 100, maxUploads: 25, maxPrice: 199, durationDays: 180 },
  { id: "pro", name: "Pro", price: 300, maxUploads: 30, maxPrice: 249, durationDays: 180 },
  { id: "elite", name: "Elite", price: 800, maxUploads: 50, maxPrice: 249, durationDays: 180 },
];

export default function SellerDashboard() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState(true);
  const [planId, setPlanId] = useState(null);
  const [uploadCount, setUploadCount] = useState(0);

  const [file, setFile] = useState(null);
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("Street Photography");
  const [status, setStatus] = useState("");

  const plan = useMemo(() => PLANS.find((p) => p.id === planId) || null, [planId]);

  useEffect(() => {
    async function loadSeller() {
      try {
        setLoading(true);
        setStatus("");
        if (!auth?.user?.uid) return;

        const userRef = doc(db, "users", auth.user.uid);
        const snap = await getDoc(userRef);
        const data = snap.exists() ? snap.data() : null;

        setPlanId(data?.planId || null);
        setUploadCount(Number(data?.uploadCount || 0));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSeller();
  }, [auth?.user?.uid]);

  async function onLogout() {
    await auth.logout();
    navigate("/", { replace: true });
  }

  async function choosePlan(id) {
    if (!auth?.user?.uid) return;
    const selected = PLANS.find((p) => p.id === id);
    if (!selected) return;

    await setDoc(
      doc(db, "users", auth.user.uid),
      {
        role: "seller",
        planId: selected.id,
        planName: selected.name,
        planMaxUploads: selected.maxUploads,
        planMaxPrice: selected.maxPrice,
        planDurationDays: selected.durationDays,
        planActivatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setPlanId(selected.id);
    setStatus("✅ Plan activated.");
  }

  async function onUpload(e) {
    e.preventDefault();
    setStatus("");

    if (!auth?.user?.uid) return;

    if (!plan) {
      setStatus("❗ Please select a plan first.");
      return;
    }

    const numericPrice = Number(price);
    if (!file) return setStatus("❗ Please choose a file.");
    if (!numericPrice || numericPrice < 1) return setStatus("❗ Enter a valid price.");
    if (numericPrice > plan.maxPrice) return setStatus(`❗ Max allowed price for ${plan.name} is ₹${plan.maxPrice}.`);
    if (uploadCount >= plan.maxUploads) return setStatus(`❗ Upload limit reached (${plan.maxUploads}).`);

    try {
      setStatus("Uploading…");

      // Storage path: seller/{uid}/{timestamp}-{filename}
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const storagePath = `seller/${auth.user.uid}/${Date.now()}-${safeName}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      // Update user upload count
      const newCount = uploadCount + 1;
      await setDoc(
        doc(db, "users", auth.user.uid),
        {
          uploadCount: newCount,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setUploadCount(newCount);
      setFile(null);
      setPrice("");
      setTitle("Street Photography");
      setStatus("✅ Uploaded successfully. (Explore page can display seller folder when rules allow it)");
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed. (Storage rules or auth domain setup may be blocking uploads)");
    }
  }

  const wrap = { maxWidth: 1120, margin: "0 auto", padding: "28px 16px 64px" };
  const card = {
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
    padding: 18,
  };
  const btnPrimary = {
    border: "none",
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
    color: "white",
    background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
    boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
  };
  const btnGhost = {
    borderRadius: 999,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 800,
    background: "white",
    border: "1px solid #e5e7eb",
    color: "#0f172a",
  };

  if (loading) {
    return (
      <main className="page">
        <section style={wrap}>
          <p style={{ padding: 20 }}>Loading…</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section style={wrap}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Seller Dashboard</h1>
        <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.65, maxWidth: 900 }}>
          Welcome{auth?.user?.displayName ? `, ${auth.user.displayName}` : ""}. Select a plan and upload within limits.
        </p>

        <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
          {/* PLAN */}
          <div style={card}>
            <p style={{ margin: 0, fontWeight: 900, color: "#0f172a" }}>Your plan</p>
            <p style={{ margin: "6px 0 0", color: "#334155" }}>
              Current: <b>{plan ? `${plan.name}` : "Not selected"}</b> • Uploads: <b>{uploadCount}</b>
              {plan ? ` / ${plan.maxUploads}` : ""} • Max price: <b>{plan ? `₹${plan.maxPrice}` : "—"}</b>
            </p>

            {!plan && (
              <div style={{ marginTop: 12, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {PLANS.map((p) => (
                  <div key={p.id} style={{ border: "1px solid rgba(148,163,184,0.25)", borderRadius: 18, padding: 14, background: "rgba(239,246,255,0.55)" }}>
                    <div style={{ fontWeight: 900, color: "#0f172a" }}>{p.name}</div>
                    <div style={{ marginTop: 6, color: "#334155", lineHeight: 1.6 }}>
                      ₹{p.price} • {p.maxUploads} uploads • max ₹{p.maxPrice} per image • {p.durationDays} days
                    </div>
                    <button style={{ ...btnPrimary, marginTop: 10 }} onClick={() => choosePlan(p.id)}>
                      Activate {p.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* UPLOAD */}
          <div style={card}>
            <p style={{ margin: 0, fontWeight: 900, color: "#0f172a" }}>Upload new image</p>
            <p style={{ margin: "6px 0 0", color: "#64748b", lineHeight: 1.6 }}>
              Upload will be blocked automatically if you exceed plan limits.
            </p>

            <form onSubmit={onUpload} style={{ marginTop: 12, display: "grid", gap: 10, maxWidth: 720 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", background: "white" }}
              />

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", background: "white" }}
              />

              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={plan ? `Price (max ₹${plan.maxPrice})` : "Price"}
                inputMode="numeric"
                style={{ padding: 10, borderRadius: 12, border: "1px solid #e5e7eb", background: "white" }}
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" style={btnPrimary}>Upload</button>
                <button type="button" style={btnGhost} onClick={() => navigate("/explore")}>View Marketplace</button>
                <button type="button" style={btnGhost} onClick={onLogout}>Logout</button>
              </div>

              {status && (
                <div style={{ marginTop: 4, color: status.startsWith("❌") || status.startsWith("❗") ? "#b91c1c" : "#0f172a", fontWeight: 700 }}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
