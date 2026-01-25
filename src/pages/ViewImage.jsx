import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import WatermarkedImage from "../components/WatermarkedImage";

// If your project already has exploreData.js, we use it to fetch title/price/etc.
// If it doesn't exist or doesn't export what we expect, this page still works (fallback UI).
let exploreData = [];
try {
  // eslint-disable-next-line global-require
  exploreData = require("../utils/exploreData.js").default || require("../utils/exploreData.js").exploreData || [];
} catch (e) {
  exploreData = [];
}

function formatINR(n) {
  const num = Number(n || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(num);
}

export default function ViewImage() {
  const { id } = useParams(); // id can be "sample1.jpg" etc.
  const [imgUrl, setImgUrl] = useState("");
  const [notFound, setNotFound] = useState(false);

  const item = useMemo(() => {
    if (!id) return null;
    const key = decodeURIComponent(id);
    return exploreData?.find?.((x) => x?.fileName === key || x?.id === key || x?.name === key) || null;
  }, [id]);

  // Resolve local public image path for sample images.
  // This supports: /photo/sample1.jpg  -> /images/sample1.jpg
  useEffect(() => {
    if (!id) return;
    const key = decodeURIComponent(id);

    // if already a full path
    if (key.startsWith("/images/")) {
      setImgUrl(key);
      return;
    }

    // most common for your setup
    const localPath = `/images/${key}`;
    setImgUrl(localPath);
  }, [id]);

  const title = item?.title || item?.category || "Photo Preview";
  const subtitle = item?.subtitle || item?.fileName || decodeURIComponent(id || "");
  const price = item?.price ?? 0;

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">{title}</h1>
            <p className="mt-1 text-sm text-black/60">{subtitle}</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-black/50">Price</div>
            <div className="text-xl font-bold text-black">{formatINR(price)}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* Preview */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              <div className="relative bg-black/[0.03]">
                {/* Watermarked preview */}
                <div className="w-full">
                  <WatermarkedImage
                    src={imgUrl}
                    alt={subtitle}
                    onError={() => setNotFound(true)}
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="text-sm font-semibold text-black">Watermarked preview</div>
                <div className="mt-1 text-sm text-black/60">
                  After purchase verification, buyers download the clean file from Buyer Dashboard.
                </div>

                {notFound ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Preview image not found. Check that the image exists in <b>/public/images/</b>.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-black/[0.02]"
              >
                ← Back to Explore
              </Link>
            </div>
          </div>

          {/* Info / Actions */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-black">License</div>
              <div className="mt-1 text-sm text-black/60">
                Standard digital license for online use. Commercial usage allowed as per policy.
              </div>

              <div className="mt-5 rounded-2xl bg-black/[0.03] p-4 text-sm text-black/70">
                ✅ Browse with watermark protection<br />
                ✅ Secure checkout<br />
                ✅ Download clean file after verification
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  to={`/checkout?photo=${encodeURIComponent(decodeURIComponent(id || ""))}`}
                  className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
                >
                  Buy Now
                </Link>

                <Link
                  to="/buyer-login"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-black/[0.02]"
                >
                  Buyer Login
                </Link>
              </div>

              <div className="mt-4 text-xs text-black/50">
                Note: “Buy Now” will proceed to checkout. If the buyer is not logged in, your checkout flow should redirect to login.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
