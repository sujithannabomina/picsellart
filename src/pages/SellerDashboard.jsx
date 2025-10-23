// src/pages/SellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { PLANS } from "../utils/plans";
import { openRazorpay, toCustomer } from "../utils/loadRazorpay";

// --- tiny utils (no external deps) ---
function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function format(ts) {
  if (!ts) return "—";
  try {
    const d = typeof ts === "number" ? new Date(ts) : ts.toDate?.() ?? new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return "—"; }
}
function rupees(n) {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? `₹${v.toFixed(2)}` : "₹0.00";
}

export default function SellerDashboard() {
  const { user } = useAuth?.() || { user: null };
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [uploadsUsed, setUploadsUsed] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const customer = toCustomer(user);

  // ---- derived limits from current plan
  const planLimits = useMemo(() => {
    if (!plan) return { uploads: 0, maxPrice: 0, days: 0, expiresAt: null };
    const found = PLANS.find(p => p.id === plan.planId) || {};
    return {
      uploads: plan.uploadsRemaining ?? found.uploads ?? 0,
      maxPrice: found.maxPrice ?? 0,
      days: found.days ?? 0,
      expiresAt: plan.expiresAt ?? null,
    };
  }, [plan]);

  // ---- guards
  useEffect(() => {
    if (!user) nav("/seller/login");
  }, [user, nav]);

  // ---- load plan + usage + recent photos
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid || user.id));
        const data = userDoc.exists() ? userDoc.data() : {};
        setPlan(data.sellerPlan || null);

        // uploads used (count photos where ownerId==user)
        const photosQ = query(
          collection(db, "photos"),
          where("ownerId", "==", user.uid || user.id),
          orderBy("createdAt", "desc"),
          limit(25)
        );
        const snap = await getDocs(photosQ);
        const rows = [];
        snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
        setPhotos(rows);
        setUploadsUsed(rows.length);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // ---- upload image (respect plan)
  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // plan checks
    if (!plan) return alert("You need an active plan to upload. Please buy a plan.");
    const now = Date.now();
    if (plan.expiresAt && now > plan.expiresAt) return alert("Your plan expired. Please renew.");
    if (uploadsUsed >= planLimits.uploads) return alert("Upload limit reached for your plan.");

    // basic create (you might already have your own server/API to watermark)
    try {
      setBusyId("upload");
      const id = `${(user.uid || user.id)}_${Date.now()}`;
      const uploadRef = sRef(storage, `Buyer/${user.uid || user.id}/${id}.jpg`);
      await uploadBytes(uploadRef, file);

      const url = await getDownloadURL(uploadRef);

      // Save metadata (watermarked version should be created by your function/webhook if you have it)
      const docRef = doc(collection(db, "photos"));
      await updateDoc(docRef, {}); // placeholder to reserve id (noop if your logic uses addDoc separately)
      const meta = {
        ownerId: user.uid || user.id,
        title: file.name.replace(/\.[^.]+$/, ""),
        price: Math.min((planLimits.maxPrice || 0), 4999) || 0, // sanity cap
        storagePath: `Buyer/${user.uid || user.id}/${id}.jpg`,
        previewUrl: url,
        createdAt: Date.now(),
      };
      await updateDoc(docRef, meta); // if you use addDoc, replace with addDoc(collection(db, "photos"), meta);

      // local lists
      setPhotos(p => [{ id: docRef.id, ...meta }, ...p]);
      setUploadsUsed(n => n + 1);

      // decrement uploadsRemaining on user document
      const userRef = doc(db, "users", user.uid || user.id);
      await updateDoc(userRef, {
        "sellerPlan.uploadsRemaining": Math.max(0, (plan.uploadsRemaining ?? planLimits.uploads) - 1),
      });
      setPlan(pl => pl ? { ...pl, uploadsRemaining: Math.max(0, (pl.uploadsRemaining ?? planLimits.uploads) - 1) } : pl);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setBusyId(null);
      e.target.value = "";
    }
  }

  async function removePhoto(photo) {
    if (!window.confirm("Delete this photo?")) return;
    try {
      setBusyId(photo.id);
      await deleteObject(sRef(storage, photo.storagePath));
      // If you store Firestore doc, delete it here (not shown to keep this simple).
      setPhotos(arr => arr.filter(p => p.id !== photo.id));
      setUploadsUsed(n => Math.max(0, n - 1));
    } catch (e) {
      console.error(e);
      alert("Could not delete.");
    } finally {
      setBusyId(null);
    }
  }

  async function renew() {
    if (!user) return nav("/seller/login");
    const current = PLANS.find(p => p.id === (plan?.planId || "")) || PLANS[0];
    try {
      await openRazorpay({
        mode: "seller_renew",
        userId: user.uid || user.id,
        planId: current.id,
        customer,
        meta: { renew: true, planName: current.name },
      });
      alert("Payment started. Your plan will extend automatically after webhook verification.");
    } catch (e) {
      console.error(e);
      alert("Could not start renewal.");
    }
  }

  if (loading) {
    return <main className="section container"><div className="muted">Loading…</div></main>;
  }

  return (
    <main className="section container">
      <h1>Seller Dashboard</h1>

      <div className="grid">
        <div className="card" style={{ gridColumn: "span 6" }}>
          <h3 style={{ marginTop: 0 }}>Plan</h3>
          {plan ? (
            <>
              <div className="line"><span>Plan ID</span><span>{plan.planId}</span></div>
              <div className="line"><span>Uploads remaining</span><span>{plan.uploadsRemaining ?? planLimits.uploads}</span></div>
              <div className="line"><span>Per-image price limit</span><span>{rupees(planLimits.maxPrice)}</span></div>
              <div className="line"><span>Expires</span><span>{format(plan.expiresAt)}</span></div>
              <button className="btn" style={{ marginTop: 12 }} onClick={renew}>Renew plan</button>
            </>
          ) : (
            <>
              <p className="muted">No active plan.</p>
              <button className="btn" onClick={() => nav("/seller/plan")}>Buy a plan</button>
            </>
          )}
        </div>

        <div className="card" style={{ gridColumn: "span 6" }}>
          <h3 style={{ marginTop: 0 }}>Upload</h3>
          <p className="muted">You can upload up to your plan’s limit. Price per image is capped by your plan.</p>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={!plan || busyId === "upload"} />
        </div>

        <div className="card" style={{ gridColumn: "span 12" }}>
          <h3 style={{ marginTop: 0 }}>Recent uploads</h3>
          {photos.length === 0 ? (
            <div className="muted">No uploads yet.</div>
          ) : (
            <div className="grid" style={{ rowGap: 16 }}>
              {photos.map(p => (
                <div key={p.id} className="card" style={{ gridColumn: "span 3", padding: 12 }}>
                  <div style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: 10, background: "#f5f5f7" }}>
                    {p.previewUrl ? <img src={p.previewUrl} alt={p.title || "photo"} /> : null}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <div className="muted">{rupees(p.price)}</div>
                    <div className="muted">{format(p.createdAt)}</div>
                  </div>
                  <button className="btn" style={{ marginTop: 8, width: "100%" }}
                          onClick={() => removePhoto(p)} disabled={busyId === p.id}>
                    {busyId === p.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
