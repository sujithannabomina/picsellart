// src/pages/Explore.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePhotos from "../hooks/usePhotos";
import { auth } from "../firebase";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Explore() {
  const navigate = useNavigate();
  const { photos, loading, error } = usePhotos();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 12;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter((p) => {
      return (
        (p.title || "").toLowerCase().includes(q) ||
        (p.filename || "").toLowerCase().includes(q) ||
        (p.kind || "").toLowerCase().includes(q) ||
        (p.sellerName || "").toLowerCase().includes(q)
      );
    });
  }, [photos, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  function formatINR(n) {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
    } catch {
      return `₹${n}`;
    }
  }

  async function onBuy(item) {
    // Require buyer login for clean purchase history & download entitlement
    const user = auth.currentUser;
    if (!user) {
      navigate("/buyer-login");
      return;
    }

    const ok = await loadRazorpayScript();
    if (!ok) {
      alert("Razorpay failed to load. Please refresh and try again.");
      return;
    }

    // Create an order on server
    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(item.price), // rupees
        currency: "INR",
        kind: item.kind, // "sample" or "seller"
        itemId: item.kind === "sample" ? item.filename : item.listingId,
        sellerId: item.kind === "seller" ? item.sellerId : null,
        buyerUid: user.uid,
        buyerEmail: user.email || "",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || "Failed to create order.");
      return;
    }

    const options = {
      key: data.keyId,
      amount: data.amountPaise,
      currency: data.currency,
      name: "Picsellart",
      description: item.kind === "sample" ? "Sample Image Purchase" : "Seller Image Purchase",
      order_id: data.orderId,
      prefill: {
        email: user.email || "",
      },
      notes: {
        kind: item.kind,
        itemId: item.kind === "sample" ? item.filename : item.listingId,
        sellerId: item.kind === "seller" ? item.sellerId : "",
        buyerUid: user.uid,
      },
      handler: async function (response) {
        const vr = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            kind: item.kind,
            amount: Number(item.price),
            currency: "INR",
            itemId: item.kind === "sample" ? item.filename : item.listingId,
            sellerId: item.kind === "seller" ? item.sellerId : null,
            buyerUid: user.uid,
            buyerEmail: user.email || "",
          }),
        });

        const vrData = await vr.json();
        if (!vr.ok) {
          alert(vrData?.error || "Payment verification failed.");
          return;
        }

        // ✅ Go to buyer dashboard after successful purchase
        navigate("/buyer-dashboard");
      },
      theme: { color: "#7c3aed" },
    };

    const rz = new window.Razorpay(options);
    rz.open();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-bold text-slate-900">Explore Marketplace</h1>
        <p className="mt-2 text-slate-600">
          Sample images + verified seller listings. Buy to download watermark-free files after verification.
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search street, interior, food, seller..."
            className="w-full md:max-w-xl rounded-full border border-slate-200 px-5 py-3 outline-none focus:ring-2 focus:ring-violet-300"
          />

          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">{filtered.length}</span> items
          </div>
        </div>

        {loading && (
          <div className="mt-10 text-slate-600">Loading images…</div>
        )}

        {!loading && !!error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[4/3] bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-900">{item.title}</div>
                        <div className="text-sm text-slate-500">{item.filename}</div>
                        {item.kind === "seller" && (
                          <div className="mt-1 text-xs text-slate-500">
                            Seller: <span className="font-medium">{item.sellerName}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-900">{formatINR(item.price)}</div>
                        <div className="text-xs text-slate-500">{item.license}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/photo/${item.kind === "sample" ? item.filename : item.listingId}`)}
                        className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>

                      <button
                        onClick={() => onBuy(item)}
                        className="flex-1 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                      >
                        Buy
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-slate-500">
                      {item.kind === "sample"
                        ? "Payment goes to Picsellart (company)."
                        : "Payment goes to Picsellart; seller earnings are tracked for payout."}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
              >
                Prev
              </button>

              <div className="text-sm text-slate-600">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
