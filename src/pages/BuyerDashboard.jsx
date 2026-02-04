// FILE PATH: src/pages/BuyerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPurchasesForBuyer } from "../utils/purchases";

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-2 text-sm",
        active ? "bg-black text-white" : "border border-slate-200 text-slate-700 hover:border-slate-400",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function BuyerDashboard() {
  const { user, booting, logout } = useAuth();
  const nav = useNavigate();

  const [tab, setTab] = useState("overview"); // overview | purchases
  const [busy, setBusy] = useState(false);

  const [purchases, setPurchases] = useState([]);
  const [pLoading, setPLoading] = useState(true);
  const [pErr, setPErr] = useState("");

  // Hard guard: if not logged in, go to buyer-login
  useEffect(() => {
    if (booting) return;
    if (!user?.uid) nav("/buyer-login", { replace: true });
  }, [booting, user, nav]);

  // Load purchases
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!user?.uid) return;
      setPErr("");
      setPLoading(true);
      try {
        const items = await getPurchasesForBuyer(user.uid);
        if (alive) setPurchases(items || []);
      } catch (e) {
        if (alive) setPErr("Unable to load purchases right now.");
      } finally {
        if (alive) setPLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
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

  // While booting, show safe shell (prevents white blank)
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
            <Link to="/explore" className="rounded-2xl bg-black px-5 py-3 text-sm text-white hover:bg-slate-900">
              Explore Pictures
            </Link>
            <button
              onClick={onLogout}
              disabled={busy}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm hover:border-slate-400 disabled:opacity-60"
            >
              {busy ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
            Overview
          </TabButton>
          <TabButton active={tab === "purchases"} onClick={() => setTab("purchases")}>
            Purchases
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
                  <Link className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:bg-slate-900" to="/explore">
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
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{pErr}</div>
            ) : purchases.length === 0 ? (
              <div className="mt-4 text-sm text-slate-600">No purchases yet.</div>
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
                          <div className="mt-1 text-sm text-slate-600">Price: ₹{Number(p.price || 0)}</div>
                        </div>
                        <div className="flex gap-2">
                          {canDownload ? (
                            <a
                              className="rounded-2xl bg-black px-4 py-2 text-sm text-white hover:bg-slate-900"
                              href={p.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Download
                            </a>
                          ) : (
                            <button
                              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
                              disabled
                            >
                              Download not ready
                            </button>
                          )}
                          <Link
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm hover:border-slate-400"
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
