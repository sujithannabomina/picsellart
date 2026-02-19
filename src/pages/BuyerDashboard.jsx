// FILE PATH: src/pages/BuyerDashboard.jsx
// ✅ COMPLETE FIX: Better error handling, logging, and fallback options

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPurchasesForBuyer } from "../utils/purchases";
import { ref, getBlob } from "firebase/storage";
import { storage } from "../firebase";

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});

  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await getPurchasesForBuyer(user.uid);
        if (!cancelled) {
          setPurchases(data);
          
          // ✅ Debug: Log purchase data
          console.log("📦 Purchases loaded:", data.length);
          data.forEach((p, i) => {
            console.log(`Purchase ${i + 1}:`, {
              id: p.id,
              fileName: p.fileName,
              storagePath: p.storagePath,
              downloadUrl: p.downloadUrl,
              hasStoragePath: !!p.storagePath,
              hasDownloadUrl: !!p.downloadUrl,
            });
          });
        }
      } catch (err) {
        console.error("❌ Error fetching purchases:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // ✅ COMPLETE DOWNLOAD FUNCTION with extensive logging and fallbacks
  const handleDownload = async (purchase) => {
    console.log("🔽 Download attempt for:", purchase.id);
    console.log("   storagePath:", purchase.storagePath);
    console.log("   downloadUrl:", purchase.downloadUrl);
    console.log("   fileName:", purchase.fileName);

    // ✅ Check 1: Do we have storagePath?
    if (!purchase.storagePath) {
      console.error("❌ No storagePath in purchase record!");
      
      // Fallback: Try opening downloadUrl if available
      if (purchase.downloadUrl) {
        console.log("⚠️ Fallback: Opening downloadUrl in new tab");
        window.open(purchase.downloadUrl, "_blank");
        return;
      }
      
      alert("Download not available. This purchase is missing required data. Please contact support.");
      return;
    }

    setDownloading((prev) => ({ ...prev, [purchase.id]: true }));

    try {
      console.log("🔄 Attempting Firebase Storage download...");
      
      // ✅ Use Firebase Storage SDK
      const fileRef = ref(storage, purchase.storagePath);
      console.log("📁 Storage reference created for:", purchase.storagePath);
      
      const blob = await getBlob(fileRef);
      console.log("✅ Blob fetched, size:", blob.size, "bytes");
      
      // Create download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      
      // Set filename
      const filename = purchase.fileName || purchase.displayName || `photo-${purchase.id}.jpg`;
      link.download = filename;
      console.log("💾 Downloading as:", filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        console.log("✅ Download complete, blob URL revoked");
      }, 100);
      
    } catch (error) {
      console.error("❌ Download error:", error);
      console.error("   Error code:", error.code);
      console.error("   Error message:", error.message);
      
      // ✅ Fallback 1: Try downloadUrl
      if (purchase.downloadUrl) {
        console.log("⚠️ Firebase SDK failed, trying downloadUrl...");
        try {
          const response = await fetch(purchase.downloadUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = purchase.fileName || "photo.jpg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          console.log("✅ Downloaded via fetch fallback");
        } catch (fetchError) {
          console.error("❌ Fetch fallback also failed:", fetchError);
          
          // ✅ Fallback 2: Open in new tab
          console.log("⚠️ Final fallback: Opening in new tab");
          window.open(purchase.downloadUrl, "_blank");
        }
      } else {
        alert(`Download failed: ${error.message}. Please contact support with purchase ID: ${purchase.id}`);
      }
    } finally {
      setDownloading((prev) => ({ ...prev, [purchase.id]: false }));
    }
  };

  const setTab = (tab) => {
    navigate(`/buyer-dashboard?tab=${tab}`);
  };

  if (!user) {
    return (
      <div className="psa-container py-10">
        <p className="text-slate-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="psa-container py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="psa-title">Buyer Dashboard</h1>
          <p className="psa-subtitle mt-1">
            Signed in as {user.email}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/explore")}
            className="psa-btn-primary"
          >
            Explore Pictures
          </button>
          <button onClick={logout} className="psa-btn-soft">
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "overview"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("purchases")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "purchases"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Purchases
        </button>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="psa-card p-6">
            <div className="text-sm text-slate-600">Total Purchases</div>
            <div className="mt-2 text-3xl font-semibold">{purchases.length}</div>
          </div>
          <div className="psa-card p-6">
            <div className="text-sm text-slate-600">Total Spent</div>
            <div className="mt-2 text-3xl font-semibold">
              ₹{purchases.reduce((sum, p) => sum + (p.price || 0), 0)}
            </div>
          </div>
          <div className="psa-card p-6">
            <div className="text-sm text-slate-600">Available Downloads</div>
            <div className="mt-2 text-3xl font-semibold">
              {purchases.filter((p) => p.storagePath || p.downloadUrl).length}
            </div>
          </div>
        </div>
      )}

      {activeTab === "purchases" && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Purchases</h2>
          
          {loading ? (
            <div className="psa-card p-8 text-center">
              <p className="text-slate-600">Loading purchases...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="psa-card p-8 text-center">
              <p className="text-slate-600 mb-4">
                You haven't purchased any photos yet.
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="psa-btn-primary"
              >
                Browse Photos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => {
                const hasDownload = purchase.storagePath || purchase.downloadUrl;
                
                return (
                  <div key={purchase.id} className="psa-card p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {purchase.displayName || purchase.fileName || "Photo"}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          Price: ₹{purchase.price || 0}
                        </div>
                        {purchase.createdAt && (
                          <div className="mt-1 text-xs text-slate-500">
                            Purchased:{" "}
                            {purchase.createdAt.toDate?.().toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }) || "Unknown"}
                          </div>
                        )}
                        
                        {/* ✅ Debug info (remove in production) */}
                        {!purchase.storagePath && (
                          <div className="mt-2 text-xs text-red-600">
                            ⚠️ Missing storagePath - contact support
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {hasDownload ? (
                          <button
                            onClick={() => handleDownload(purchase)}
                            disabled={downloading[purchase.id]}
                            className="psa-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {downloading[purchase.id] ? "Downloading..." : "Download"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="psa-btn-soft opacity-50 cursor-not-allowed"
                          >
                            Download not ready
                          </button>
                        )}
                        <button
                          onClick={() => navigate("/explore")}
                          className="psa-btn-soft"
                        >
                          Buy more
                        </button>
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
  );
}