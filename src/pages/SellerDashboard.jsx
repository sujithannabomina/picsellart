// FILE: src/pages/SellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { db, storage } from "../firebase";
import { PLANS, formatINR } from "../utils/plans.js";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

function formatDate(d) {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(d);
  } catch {
    return d.toDateString();
  }
}

function formatINR0(n) {
  return formatINR(n);
}

export default function SellerDashboard() {
  const nav = useNavigate();
  const { user, userDoc, loading, logout, refreshUserDoc } = useAuth();

  const [tab, setTab] = useState("overview");

  const [planDoc, setPlanDoc] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);

  const [listings, setListings] = useState([]);
  const [purchases, setPurchases] = useState([]);

  // upload form
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("Street Photography");
  const [price, setPrice] = useState(199);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function loadPlan() {
      setPlanLoading(true);
      const snap = await getDoc(doc(db, "sellerPlans", user.uid));
      setPlanDoc(snap.exists() ? snap.data() : null);
      setPlanLoading(false);
    }
    loadPlan();

    const qListings = query(collection(db, "listings"), where("sellerId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub1 = onSnapshot(qListings, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setListings(rows);
    });

    const qPurchases = query(collection(db, "purchases"), where("sellerId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub2 = onSnapshot(qPurchases, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPurchases(rows);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  const activePlan = useMemo(() => {
    if (!planDoc || planDoc.status !== "active" || !planDoc.endAt) return null;
    const end = planDoc.endAt?.toDate ? planDoc.endAt.toDate() : new Date(planDoc.endAt);
    if (end.getTime() <= Date.now()) return null;
    return planDoc;
  }, [planDoc]);

  const limits = useMemo(() => {
    if (activePlan) return { maxUploads: activePlan.maxUploads, maxPrice: activePlan.maxPrice, planName: activePlan.planName, endAt: activePlan.endAt };
    // fallback plan info if doc missing
    return { maxUploads: 0, maxPrice: 0, planName: "No Active Plan", endAt: null };
  }, [activePlan]);

  const uploadsUsed = listings.length;
  const uploadsRemaining = Math.max(0, (limits.maxUploads || 0) - uploadsUsed);

  const totalEarnings = useMemo(() => purchases.reduce((s, p) => s + (Number(p.amountINR || 0) || 0), 0), [purchases]);

  const earnings7d = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return purchases
      .filter((p) => {
        const t = p.createdAt?.toDate ? p.createdAt.toDate().getTime() : new Date(p.createdAt || 0).getTime();
        return t >= cutoff;
      })
      .reduce((s, p) => s + (Number(p.amountINR || 0) || 0), 0);
  }, [purchases]);

  async function ensureAccess() {
    if (!user) return false;
    if (!activePlan) {
      nav("/seller-login", { replace: true });
      return false;
    }
    const sp = userDoc?.sellerProfile;
    if (!sp || !sp.fullName || !sp.phone || !sp.upi) {
      nav("/seller-login", { replace: true });
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (!loading && user) ensureAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, activePlan, userDoc]);

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  if (!user) {
    return (
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 18px" }}>
        <h2 style={{ margin: 0, fontWeight: 900 }}>Seller Dashboard</h2>
        <p style={{ color: "#555" }}>Please login as seller to continue.</p>
        <button onClick={() => nav("/seller-login")} style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "12px 16px", borderRadius: 12, fontWeight: 900 }}>
          Go to Seller Login
        </button>
      </div>
    );
  }

  const sellerProfile = userDoc?.sellerProfile || {};

  async function uploadListing(e) {
    e.preventDefault();
    if (!(await ensureAccess())) return;

    if (!file) return alert("Please choose an image file");
    const p = Number(price);
    if (!p || p < 1) return alert("Enter a valid price");
    if (p > (limits.maxPrice || 0)) return alert(`Your plan max price is ₹${limits.maxPrice}`);
    if (uploadsRemaining <= 0) return alert("Upload limit reached. Upgrade plan or delete an image.");

    setUploading(true);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const storagePath = `seller_uploads/${user.uid}/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const listingRef = doc(collection(db, "listings"));
      await setDoc(listingRef, {
        sellerId: user.uid,
        title: (title || "Street Photography").trim(),
        priceINR: p,
        previewUrl: url,
        storagePath,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setFile(null);
      setTitle("Street Photography");
      setPrice(Math.min(limits.maxPrice || 199, 199));
      alert("Uploaded successfully");
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function removeListing(listing) {
    if (!confirm("Delete this image permanently? This will remove it from storage too.")) return;
    try {
      if (listing.storagePath) {
        await deleteObject(ref(storage, listing.storagePath));
      }
      await deleteDoc(doc(db, "listings", listing.id));
      alert("Deleted");
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    await setDoc(
      doc(db, "users", user.uid),
      {
        sellerProfile: {
          fullName: (sellerProfile.fullName || "").trim(),
          phone: (sellerProfile.phone || "").trim(),
          upi: (sellerProfile.upi || "").trim(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    await refreshUserDoc();
    alert("Profile updated");
  }

  const endDate = activePlan?.endAt?.toDate ? activePlan.endAt.toDate() : activePlan?.endAt ? new Date(activePlan.endAt) : null;

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", padding: "30px 18px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 900, fontSize: 34, color: "#111" }}>Seller Dashboard</h1>
          <div style={{ marginTop: 6, color: "#555" }}>
            Welcome <b>{sellerProfile.fullName || userDoc?.displayName || "Seller"}</b> — manage uploads, plan & earnings.
          </div>
        </div>
        <button
          onClick={async () => {
            await logout();
            nav("/");
          }}
          style={{ background: "#111", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
        {[
          ["overview", "Overview"],
          ["uploads", "Uploads"],
          ["earnings", "Earnings"],
          ["profile", "Profile"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: tab === k ? "2px solid #7c3aed" : "1px solid #eee",
              background: "#fff",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14, marginTop: 16 }}>
          <div style={{ border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, color: "#111" }}>Plan Status</div>
            {!activePlan ? (
              <div style={{ marginTop: 10, color: "#b00020", fontWeight: 800 }}>
                No active plan.{" "}
                <button onClick={() => nav("/seller-login")} style={{ marginLeft: 8, background: "#7c3aed", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 10, fontWeight: 900 }}>
                  Purchase Plan
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <div style={{ color: "#111", fontWeight: 900 }}>{activePlan.planName}</div>
                <div style={{ color: "#555" }}>
                  Expires on <b>{endDate ? formatDate(endDate) : "-"}</b>
                </div>
                <div style={{ color: "#555" }}>
                  Uploads: <b>{uploadsUsed}</b> / <b>{limits.maxUploads}</b> (Remaining <b>{uploadsRemaining}</b>)
                </div>
                <div style={{ color: "#555" }}>
                  Max price per image: <b>₹{limits.maxPrice}</b>
                </div>
                <button onClick={() => nav("/seller-login")} style={{ width: "fit-content", marginTop: 6, background: "#111", color: "#fff", border: "none", padding: "10px 12px", borderRadius: 12, fontWeight: 900 }}>
                  Upgrade Plan
                </button>
              </div>
            )}
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, color: "#111" }}>Earnings Snapshot</div>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
                <div style={{ color: "#666", fontSize: 13 }}>Total earnings</div>
                <div style={{ fontWeight: 900, fontSize: 20 }}>{formatINR0(totalEarnings)}</div>
              </div>
              <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 12 }}>
                <div style={{ color: "#666", fontSize: 13 }}>Last 7 days</div>
                <div style={{ fontWeight: 900, fontSize: 20 }}>{formatINR0(earnings7d)}</div>
              </div>
              <div style={{ color: "#666", fontSize: 13, lineHeight: 1.5 }}>
                Payouts are processed weekly to your UPI: <b>{sellerProfile.upi || "-"}</b>
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 980px){
              div[style*="grid-template-columns: 1.2fr 0.8fr"]{ grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      )}

      {/* Uploads */}
      {tab === "uploads" && (
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 14 }}>
          <div style={{ border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, color: "#111" }}>Upload new image</div>
            <div style={{ color: "#666", marginTop: 6 }}>
              Remaining uploads: <b>{uploadsRemaining}</b> • Max price: <b>₹{limits.maxPrice}</b>
            </div>

            <form onSubmit={uploadListing} style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ddd" }}
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ddd" }}
              />
              <button
                type="submit"
                disabled={uploading}
                style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "12px 14px", borderRadius: 12, fontWeight: 900, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.7 : 1 }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, color: "#111" }}>Your uploads</div>
            <div style={{ color: "#666", marginTop: 6 }}>
              {uploadsUsed} uploaded • {uploadsRemaining} remaining
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
              {listings.length === 0 && <div style={{ color: "#666" }}>No uploads yet.</div>}
              {listings.map((x) => (
                <div key={x.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 12, alignItems: "center", border: "1px solid #eee", borderRadius: 16, padding: 12 }}>
                  <img src={x.previewUrl} alt={x.title} style={{ width: 120, height: 80, borderRadius: 12, objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: 900, color: "#111" }}>{x.title}</div>
                    <div style={{ color: "#666", marginTop: 4 }}>{formatINR0(x.priceINR || 0)}</div>
                  </div>
                  <button onClick={() => removeListing(x)} style={{ background: "#111", color: "#fff", border: "none", padding: "10px 12px", borderRadius: 12, fontWeight: 900, cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @media (max-width: 980px){
              div[style*="grid-template-columns: 0.9fr 1.1fr"]{ grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      )}

      {/* Earnings */}
      {tab === "earnings" && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { t: "Total earnings", v: formatINR0(totalEarnings) },
              { t: "Last 7 days", v: formatINR0(earnings7d) },
              { t: "Weekly payout", v: sellerProfile.upi ? "Enabled" : "Missing UPI" },
            ].map((c) => (
              <div key={c.t} style={{ border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
                <div style={{ color: "#666", fontSize: 13 }}>{c.t}</div>
                <div style={{ marginTop: 8, fontWeight: 900, fontSize: 20, color: "#111" }}>{c.v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 900, color: "#111" }}>Sales</div>
            <div style={{ color: "#666", marginTop: 6 }}>Every paid purchase is listed here for transparency.</div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {purchases.length === 0 && <div style={{ color: "#666" }}>No sales yet.</div>}
              {purchases.map((p) => (
                <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 900, color: "#111" }}>{p.title || "Image purchase"}</div>
                    <div style={{ color: "#666", marginTop: 4, fontSize: 13 }}>
                      {p.createdAt?.toDate ? formatDate(p.createdAt.toDate()) : "—"} • Payment: {p.paymentId || "—"}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, color: "#111" }}>{formatINR0(p.amountINR || 0)}</div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @media (max-width: 980px){
              div[style*="grid-template-columns: repeat(3, 1fr)"]{ grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      )}

      {/* Profile */}
      {tab === "profile" && (
        <div style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 18, background: "#fff", padding: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 900, color: "#111" }}>Personal & Payout Info</div>
          <div style={{ color: "#666", marginTop: 6 }}>This information is used for profile and weekly payouts.</div>

          <form onSubmit={updateProfile} style={{ marginTop: 12, display: "grid", gap: 10, maxWidth: 560 }}>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Name</div>
              <input
                value={sellerProfile.fullName || ""}
                onChange={(e) =>
                  setDoc(doc(db, "users", user.uid), { sellerProfile: { ...sellerProfile, fullName: e.target.value } }, { merge: true }).then(refreshUserDoc)
                }
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Phone</div>
              <input
                value={sellerProfile.phone || ""}
                onChange={(e) =>
                  setDoc(doc(db, "users", user.uid), { sellerProfile: { ...sellerProfile, phone: e.target.value } }, { merge: true }).then(refreshUserDoc)
                }
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>UPI</div>
              <input
                value={sellerProfile.upi || ""}
                onChange={(e) =>
                  setDoc(doc(db, "users", user.uid), { sellerProfile: { ...sellerProfile, upi: e.target.value } }, { merge: true }).then(refreshUserDoc)
                }
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
              />
            </div>

            <button type="submit" style={{ background: "#7c3aed", color: "#fff", border: "none", padding: "12px 14px", borderRadius: 12, fontWeight: 900 }}>
              Save Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
