// FILE PATH: src/pages/BuyerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPurchasesForBuyer } from "../utils/purchases";

// ✅ Added: generate download link when missing
import { getDownloadURL, ref as sRef } from "firebase/storage";
import { storage } from "../firebase"; // IMPORTANT: your project must export storage from src/firebase.js

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-2 text-sm transition",
        active
          ? "psa-btn-primary"
          : "psa-btn-soft border border-slate-200 text-slate-700 hover:border-slate-400",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function BuyerDashboard() {
  const { user, booting, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("overview"); // overview | purchases
  const [busy, setBusy] = useState(false);

  const [purchases, setPurchases] = useState([]);
  const [pLoading, setPLoading] = useState(true);
  const [pErr, setPErr] = useState("");
  const [banner, setBanner] = useState("");

  // URL-driven tab + banner message (prevents weird back/refresh behavior)
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const t = sp.get("tab");
    const msg = sp.get("msg");

    if (t === "purchases" || t === "overview") setTab(t);
    if (msg) setBanner(msg);

    if (t || msg) nav("/buyer-dashboard", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hard guard: if not logged in, go to buyer-login
  useEffect(() => {
    if (booting) return;
    if (!user?.uid) nav("/buyer-login", { replace: true });
  }, [booting, user, nav]);

  const loadPurchases = async (uid) => {
    setPErr("");
    setPLoading(true);
    try {
      const items = await getPurchasesForBuyer(uid);

      // ✅ Production improvement:
      // If server didn’t store downloadUrl OR it expired, generate it from Storage path.
      const enriched = await Promise.all(
        (items || []).map(async (p) => {
          if (p?.downloadUrl) return p;
          if (!p?.storagePath) return p;

          try {
            const url = await getDownloadURL(sRef(storage, p.storagePath));
            return { ...p, downloadUrl: url };
          } catch {
            return p; // keep "Download not ready" if storage rules block it
          }
        })
      );

      setPurchases(enriched || []);
    } catch {
      setPErr("We couldn’t load your purchases right now. Please try again.");
    } finally {
      setPLoading(false);
    }
  };

  // Load purchases (safe + stable)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user?.uid) return;
      if (!alive) return;
      await loadPurchases(user.uid);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const totalSpent = useMemo(() => {
    return purchases.reduce((sum, p) => sum + Number(p?.price || 0), 0);
  }, [purchases]);

  const onLogout = async () => {
    setBusy(true);
    try {
      await logout();
      nav("/", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="h-10 w-64 rounded-xl bg-slate-100 animate-pulse" />
          <div className="mt-6 h-24 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Buyer Dashboard</h1>
            <div className="mt-2 text-sm text-slate-600">
              Signed in as <span className="font-medium">{user?.email}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/explore" className="psa-btn-primary rounded-2xl px-5 py-3 text-sm">
              Explore Pictures
            </Link>
            <button
              onClick={onLogout}
              disabled={busy}
              className="psa-btn-soft rounded-2xl border border-slate-200 px-5 py-3 text-sm hover:border-slate-400 disabled:opacity-60"
            >
              {busy ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {banner ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {banner}
            <button
              className="ml-3 underline underline-offset-2"
              onClick={() => setBanner("")}
              type="button"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
            Overview
          </TabButton>
          <TabButton active={tab === "purchases"} onClick={() => setTab("purchases")}>
            Purchases <span className="ml-1 text-xs text-slate-500">({purchases.length})</span>
          </TabButton>
        </div>

        {tab === "overview" ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-sm text-slate-600">Total Purchases</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{purchases.length}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-sm text-slate-600">Total Spent</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">₹{totalSpent}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-sm text-slate-600">Quick Action</div>
                <div className="mt-3">
                  <Link className="psa-btn-primary rounded-2xl px-4 py-2 text-sm" to="/explore">
                    Browse & Buy
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 p-6">
              <div className="text-lg font-semibold">Your Activity</div>
              <div className="mt-2 text-sm text-slate-600">
                Purchases and downloads will appear here as soon as you buy items.
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-semibold">Purchases</div>
              <div className="text-sm text-slate-600">{purchases.length} item(s)</div>
            </div>

            {pLoading ? (
              <div className="mt-4 h-24 rounded-2xl bg-slate-100 animate-pulse" />
            ) : pErr ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-medium">Something went wrong</div>
                <div className="mt-1">{pErr}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="psa-btn-primary rounded-2xl px-4 py-2 text-sm"
                    onClick={() => user?.uid && loadPurchases(user.uid)}
                  >
                    Retry
                  </button>
                  <Link
                    className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
                    to="/explore"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            ) : purchases.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-medium">No purchases yet</div>
                <div className="mt-1 text-slate-600">Browse photos and buy anytime.</div>
                <div className="mt-3">
                  <Link className="psa-btn-primary rounded-2xl px-4 py-2 text-sm" to="/explore">
                    Browse Photos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {purchases.map((p) => {
                  const title = p.displayName || p.fileName || "Photo";
                  const canDownload = !!p.downloadUrl;
                  return (
                    <div key={p.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-medium">{title}</div>
                          <div className="mt-1 text-sm text-slate-600">
                            Price: ₹{Number(p.price || 0)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {canDownload ? (
                            <a
                              className="psa-btn-primary rounded-2xl px-4 py-2 text-sm"
                              href={p.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Download
                            </a>
                          ) : (
                            <button
                              className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
                              disabled
                            >
                              Download not ready
                            </button>
                          )}
                          <Link
                            className="psa-btn-soft rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
                            to="/explore"
                          >
                            Buy more
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
