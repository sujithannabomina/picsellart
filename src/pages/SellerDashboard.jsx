// src/pages/SellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Auth / Firebase (assumes your project already has these set up)
import { useAuth } from "../context/AuthContext"; // must expose { user }
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Timestamp,
} from "firebase/firestore";

/* ----------------------------------------------------------------
   Local plan map (kept here to avoid import/name mismatches)
   If you already centralize plans in src/utils/plans.js, keep both
   in sync; this local map prevents broken imports during deploy.
----------------------------------------------------------------- */
const PLAN_MAP = {
  starter: { id: "starter", name: "Starter", uploads: 25, maxPrice: 199, days: 180, priceINR: 100 },
  pro:     { id: "pro",     name: "Pro",     uploads: 30, maxPrice: 249, days: 180, priceINR: 300 },
  elite:   { id: "elite",   name: "Elite",   uploads: 50, maxPrice: 249, days: 180, priceINR: 800 },
};

/* -------- tiny date helpers (no external deps) -------- */
function pad(n){ return n < 10 ? `0${n}` : `${n}`; }
function formatDate(ts) {
  if (!ts) return "—";
  try {
    const d = ts instanceof Date ? ts : new Date(ts?.toMillis ? ts.toMillis() : ts);
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
  } catch {
    return "—";
  }
}
function daysLeft(exp) {
  if (!exp) return 0;
  const end = exp instanceof Date ? exp : new Date(exp?.toMillis ? exp.toMillis() : exp);
  const ms = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/* -------- UI bits -------- */
function Stat({ label, value, hint }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
        {hint ? <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>{hint}</div> : null}
      </div>
    </div>
  );
}

function Section({ title, children, right }) {
  return (
    <section className="section">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h2>
        {right ?? null}
      </div>
      <div className="container" style={{ marginTop: 16 }}>
        {children}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   SellerDashboard
   - Reads seller profile from Firestore: sellers/{uid}
   - Shows plan, upload count, remaining days
   - Enforces (client-side) upload cap and max price per plan
   - Links to Pay/Renew page when expired or no plan
   - Lists latest uploads (from photos where ownerId == uid)
----------------------------------------------------------------- */
export default function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [sellerDoc, setSellerDoc] = useState(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [recent, setRecent] = useState([]);

  const plan = useMemo(() => {
    if (!sellerDoc?.planId) return null;
    return PLAN_MAP[sellerDoc.planId] ?? null;
  }, [sellerDoc?.planId]);

  const expired = useMemo(() => {
    if (!sellerDoc?.expiresAt) return true;
    return Date.now() > new Date(sellerDoc.expiresAt?.toMillis ? sellerDoc.expiresAt.toMillis() : sellerDoc.expiresAt).getTime();
  }, [sellerDoc?.expiresAt]);

  const remainingDays = useMemo(() => daysLeft(sellerDoc?.expiresAt), [sellerDoc?.expiresAt]);

  useEffect(() => {
    let mounted = true;
    async function boot() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        // 1) read seller profile
        const ref = doc(db, "sellers", user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;

        // 2) count uploads
        const countQ = query(collection(db, "photos"), where("ownerId", "==", user.uid));
        const agg = await getCountFromServer(countQ);

        // 3) recent uploads list (up to 10)
        const recentQ = query(
          collection(db, "photos"),
          where("ownerId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const rs = await getDocs(recentQ);
        const rows = rs.docs.map(d => ({ id: d.id, ...d.data() }));

        if (!mounted) return;
        setSellerDoc(data);
        setUploadCount(agg.data().count);
        setRecent(rows);
      } catch (e) {
        console.error("Dashboard load failed:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    boot();
    return () => { mounted = false; };
  }, [user?.uid]);

  const canUploadMore = useMemo(() => {
    if (!plan || expired) return false;
    return uploadCount < (plan?.uploads ?? 0);
  }, [plan, expired, uploadCount]);

  if (!user) {
    return (
      <main className="section">
        <div className="container card">
          <div className="card-body">
            <h1 className="page-title">Seller dashboard</h1>
            <p className="page-desc">Please sign in first.</p>
            <div style={{ marginTop: 16 }}>
              <Link to="/seller/login" className="btn btn--brand">Seller Login</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="skeleton" style={{ height: 140, marginBottom: 16 }} />
          <div className="grid grid--3">
            <div className="skeleton" style={{ height: 120 }} />
            <div className="skeleton" style={{ height: 120 }} />
            <div className="skeleton" style={{ height: 120 }} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Top card */}
      <section className="section">
        <div className="container card">
          <div className="card-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div className="muted" style={{ marginBottom: 6 }}>Welcome</div>
              <h1 className="page-title" style={{ margin: 0 }}>{user.displayName || "Seller"}</h1>
              <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>{user.email}</div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              {(!plan || expired) ? (
                <>
                  <span className="badge" style={{ background: "#fee2e2", color: "#991b1b" }}>
                    {plan ? "Plan expired" : "No active plan"}
                  </span>
                  <Link to="/seller/plan" className="btn btn--brand">Buy a Plan</Link>
                </>
              ) : (
                <>
                  <span className="badge" style={{ background: "#dcfce7", color: "#166534" }}>
                    {plan.name} / ₹{plan.priceINR} / {plan.uploads} uploads / Max ₹{plan.maxPrice}
                  </span>
                  <span className="badge">Expires: {formatDate(sellerDoc.expiresAt)}</span>
                  <span className="badge">{remainingDays} days left</span>
                  <Link to="/seller/renew" className="btn btn--subtle">Pay Again</Link>
                </>
              )}
              <button
                className="btn btn--brand"
                disabled={!canUploadMore}
                onClick={() => navigate("/seller/upload")}
                title={!canUploadMore ? "Upgrade or renew to upload more" : "Upload a new photo"}
              >
                New Upload
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section title="Your stats">
        <div className="grid grid--3">
          <Stat label="Total uploads" value={uploadCount} hint={plan ? `Limit: ${plan.uploads}` : "Buy a plan to upload"} />
          <Stat label="Max price per image" value={plan ? `₹${plan.maxPrice}` : "—"} hint={plan ? `${plan.name} plan` : "No active plan"} />
          <Stat label="Plan days remaining" value={plan ? `${remainingDays} days` : "—"} hint={plan ? `Expires ${formatDate(sellerDoc.expiresAt)}` : "No active plan"} />
        </div>
      </Section>

      {/* Recent uploads */}
      <Section
        title="Recent uploads"
        right={
          <button
            className="btn btn--brand"
            disabled={!canUploadMore}
            onClick={() => navigate("/seller/upload")}
          >
            Upload photo
          </button>
        }
      >
        {recent.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <p className="muted">No uploads yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid--3">
            {recent.map((r) => (
              <div key={r.id} className="card" style={{ overflow: "hidden" }}>
                <div className="card-body" style={{ padding: 0 }}>
                  {/* Prefer watermarked URL if present */}
                  {r.watermarkedUrl ? (
                    <img src={r.watermarkedUrl} alt={r.title || "photo"} />
                  ) : r.thumbUrl ? (
                    <img src={r.thumbUrl} alt={r.title || "photo"} />
                  ) : r.publicUrl ? (
                    <img src={r.publicUrl} alt={r.title || "photo"} />
                  ) : (
                    <div className="skeleton" style={{ height: 180 }} />
                  )}
                </div>
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.title || "Untitled"}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {r.createdAt?.toMillis ? formatDate(r.createdAt) : "—"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800 }}>₹{r.price ?? "—"}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{r.status || "active"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Help */}
      <section className="section">
        <div className="container card">
          <div className="card-body">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>How pricing and limits work</h3>
            <ul className="muted" style={{ paddingLeft: 18, marginTop: 6 }}>
              <li>Your plan enforces a maximum <strong>number of uploads</strong> and a maximum <strong>price per image</strong>.</li>
              <li>Plan validity is <strong>180 days</strong>. After that, you’ll need to pay again to get access.</li>
              <li>Watermarks are visible to you and buyers until purchase. After payment, the buyer can download the clean HD image.</li>
            </ul>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Link to="/seller/plan" className="btn btn--brand">Buy a Plan</Link>
              <Link to="/seller/renew" className="btn btn--subtle">Pay Again</Link>
              <Link to="/contact" className="btn">Need help?</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">© {new Date().getFullYear()} Picsellart</footer>
    </main>
  );
}
