import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * IMPORTANT:
 * Put your 6 local homepage images inside:
 *   /public/images/
 *
 * And name them exactly:
 *   sample1.jpg ... sample6.jpg
 *
 * If your names are different, just edit the array below to match.
 */
const HOME_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LandingPage() {
  const location = useLocation();

  const [heroImage, setHeroImage] = useState(HOME_IMAGES[0]);
  const [gridImages, setGridImages] = useState(HOME_IMAGES);

  // Change hero + grid arrangement on:
  // - page refresh
  // - every new visit to "/"
  // (location.key changes on navigation)
  useEffect(() => {
    const shuffled = shuffleArray(HOME_IMAGES);
    setHeroImage(shuffled[0]);
    setGridImages(shuffled);
  }, [location.key]);

  const fallbackHeroStyle = useMemo(
    () => ({
      background:
        "radial-gradient(1200px circle at 20% 20%, rgba(124,58,237,0.20), transparent 60%), radial-gradient(1200px circle at 80% 10%, rgba(16,185,129,0.10), transparent 55%), linear-gradient(to bottom, #ffffff, #fafafa)",
    }),
    []
  );

  const heroStyle = useMemo(
    () => ({
      backgroundImage: `url("${heroImage}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
    [heroImage]
  );

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={heroStyle} />
        {/* overlay */}
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />
        {/* subtle gradient tint */}
        <div className="absolute inset-0" style={fallbackHeroStyle} />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-black/70">
                <span className="h-2 w-2 rounded-full bg-violet-600" />
                Buy licensed photos • Sell your work • Instant downloads
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-black sm:text-5xl">
                Turn your Photos into Income
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-black/70">
                Discover curated images from our public gallery and verified sellers.
                Sellers upload once — buyers purchase securely and download watermark-free files after payment.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
                >
                  Explore Pictures
                </Link>

                <Link
                  to="/seller-login"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-black hover:bg-white"
                >
                  Become a Seller
                </Link>

                <Link
                  to="/buyer-login"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-black hover:bg-white"
                >
                  Buyer Login
                </Link>
              </div>

              {/* quick trust row */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/75 p-4">
                  <div className="text-sm font-semibold text-black">Watermarked previews</div>
                  <div className="mt-1 text-xs text-black/60">
                    Safe browsing with clean previews.
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/75 p-4">
                  <div className="text-sm font-semibold text-black">Secure checkout</div>
                  <div className="mt-1 text-xs text-black/60">
                    Payment verification before downloads.
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/75 p-4">
                  <div className="text-sm font-semibold text-black">Seller plans</div>
                  <div className="mt-1 text-xs text-black/60">
                    Upload limits + pricing caps by plan.
                  </div>
                </div>
              </div>
            </div>

            {/* Right side card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-black/10 bg-white/75 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="PicSellArt Logo"
                    className="h-10 w-10 rounded-full border border-black/10 bg-white object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-black">Start earning in 2 minutes</div>
                    <div className="text-xs text-black/60">Photos, Art, Designs and more.</div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-black/[0.03] p-4">
                  <div className="text-xs font-semibold text-black/70">What you can do</div>
                  <ul className="mt-2 space-y-2 text-sm text-black/70">
                    <li className="flex gap-2">
                      <span className="mt-[6px] h-2 w-2 rounded-full bg-violet-600" />
                      Select a Seller plan and upload your work
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[6px] h-2 w-2 rounded-full bg-violet-600" />
                      Access dashboard-Track your earnings-upload limits
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-[6px] h-2 w-2 rounded-full bg-violet-600" />
                      Fast Payouts - weekly
                    </li>
                  </ul>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    to="/explore"
                    className="flex-1 rounded-full bg-black px-4 py-2 text-center text-sm font-semibold text-white hover:bg-black/90"
                  >
                    Explore
                  </Link>
                  <Link
                    to="/contact"
                    className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-center text-sm font-semibold text-black hover:bg-white/80"
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-4 text-xs text-black/50">
                  Buyers can view photo page and buy with secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREVIEW GRID */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Featured </h2>
            <p className="mt-1 text-sm text-black/60">
              These come from our best <span className="font-semibold">Sellers</span> .
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-black/[0.02]"
          >
            View full marketplace →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gridImages.map((src) => (
            <div
              key={src}
              className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/[0.03]">
                <img
                  src={src}
                  alt="Sample preview"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  onError={(e) => {
                    // hide broken image box if name mismatch
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.classList.add("flex", "items-center", "justify-center");
                    e.currentTarget.parentElement.innerHTML =
                      '<div class="text-sm text-black/50 p-6 text-center">Image not found.<br/>Rename your 6 images to sample1.jpg...sample6.jpg inside /public/images/</div>';
                  }}
                />
              </div>

              <div className="p-4">
                <div className="text-sm font-semibold text-black">Premium preview</div>
                <div className="mt-1 text-xs text-black/60">
                  Clean layout • responsive • professional spacing
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-bold text-black">Ready to start?</div>
              <div className="text-sm text-black/60">
                Become a seller and list your work.
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/buyer-login"
                className="rounded-full bg-violet-600 px-6 py-2 text-center text-sm font-semibold text-white hover:bg-violet-700"
              >
                Buyer Login
              </Link>
              <Link
                to="/seller-login"
                className="rounded-full border border-black/10 bg-white px-6 py-2 text-center text-sm font-semibold text-black hover:bg-black/[0.02]"
              >
                Seller Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



