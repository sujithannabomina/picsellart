// src/pages/SellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ref, listAll, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth } from "../hooks/useAuth";

const PLAN_RULES = {
  starter: { name: "Starter", maxUploads: 25, maxPrice: 199, durationDays: 180 },
  pro: { name: "Pro", maxUploads: 30, maxPrice: 249, durationDays: 180 },
  elite: { name: "Elite", maxUploads: 50, maxPrice: 249, durationDays: 180 },
};

export default function SellerDashboard() {
  const { user, sellerPlan, logout } = useAuth();

  const rules = useMemo(() => PLAN_RULES[sellerPlan] || PLAN_RULES.starter, [sellerPlan]);

  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");

  const folderPath = useMemo(() => `seller/${user?.uid || "unknown"}`, [user?.uid]);

  const loadMyUploads = async () => {
    if (!user) return;
    try {
      const folderRef = ref(storage, folderPath);
      const res = await listAll(folderRef);
      const files = await Promise.all(
        res.items.map(async (it) => ({ name: it.name, url: await getDownloadURL(it) }))
      );
      setItems(files);
    } catch (e) {
      console.warn("Seller folder not ready yet:", e);
      setItems([]);
    }
  };

  useEffect(() => {
    loadMyUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const remaining = Math.max(0, rules.maxUploads - items.length);

  const onUpload = async (e) => {
    e.preventDefault();
    setMsg("");

    const file = e.target.file?.files?.[0];
    const p = Number(price);

    if (!file) return setMsg("Please choose an image file.");
    if (!Number.isFinite(p) || p <= 0) return setMsg("Enter a valid price.");
    if (p > rules.maxPrice) return setMsg(`Your plan allows max ₹${rules.maxPrice} per image.`);
    if (items.length >= rules.maxUploads) return setMsg(`Upload limit reached (${rules.maxUploads}).`);

    try {
      setBusy(true);

      // Upload to seller/{uid}/filename
      const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, "_");
      const fileRef = ref(storage, `${folderPath}/${safeName}`);

      await uploadBytes(fileRef, file);

      setMsg("✅ Uploaded successfully.");
      e.target.reset();
      setPrice("");
      await loadMyUploads();
    } catch (err) {
      console.error(err);
      setMsg("Upload failed. Check Storage rules and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, margin: 0 }}>Seller Dashboard</h1>
          <p style={{ marginTop: 8, color: "#4b5563", lineHeight: 1.7 }}>
            Welcome, <b>{user?.displayName || "Seller"}</b> ({user?.email})
          </p>

          <div
            style={{
              marginTop: 12,
              borderRadius: 18,
              padding: 14,
              border: "1px solid rgba(148,163,184,0.25)",
              background: "rgba(239,246,255,0.55)",
              color: "#0f172a",
              lineHeight: 1.7,
            }}
          >
            <b>Plan:</b> {rules.name} • <b>Max uploads:</b> {rules.maxUploads} •{" "}
            <b>Max price:</b> ₹{rules.maxPrice}/image • <b>Remaining:</b> {remaining}
          </div>

          <form onSubmit={onUpload} style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 800, color: "#0f172a" }}>Upload image</label>
              <input name="file" type="file" accept="image/*" />
            </div>

            <div style={{ display: "grid", gap: 6, maxWidth: 260 }}>
              <label style={{ fontWeight: 800, color: "#0f172a" }}>Set price (₹)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={`Max ₹${rules.maxPrice}`}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  background: "white",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={busy}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 16px",
                  cursor: busy ? "not-allowed" : "pointer",
                  fontWeight: 800,
                  color: "white",
                  background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
                  boxShadow: "0 18px 40px rgba(79, 70, 229, 0.35)",
                  opacity: busy ? 0.75 : 1,
                }}
              >
                {busy ? "Uploading…" : "Upload"}
              </button>

              <button
                type="button"
                onClick={logout}
                className="btn btn-nav"
                style={{ padding: "10px 16px" }}
              >
                Logout
              </button>
            </div>

            {msg && <div style={{ color: msg.startsWith("✅") ? "#065f46" : "#7f1d1d" }}>{msg}</div>}
          </form>

          <div style={{ marginTop: 18 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", fontWeight: 900, color: "#0f172a" }}>
              Your uploads ({items.length})
            </h3>

            {items.length === 0 ? (
              <div style={{ color: "#64748b" }}>No uploads yet.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {items.map((it) => (
                  <div
                    key={it.name}
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      border: "1px solid rgba(148,163,184,0.25)",
                      background: "rgba(255,255,255,0.9)",
                      boxShadow: "0 14px 32px rgba(15,23,42,0.08)",
                    }}
                  >
                    <img src={it.url} alt={it.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                    <div style={{ padding: 10, color: "#334155", fontSize: "0.9rem" }}>{it.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
