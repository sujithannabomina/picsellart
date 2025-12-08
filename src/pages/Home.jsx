import React, { useMemo } from "react";

const HOME_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

// Pick 4 random images on each page load
function pickHeroImages() {
  const arr = [...HOME_IMAGES];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 4);
}

const Home = () => {
  const heroImages = useMemo(() => pickHeroImages(), []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 py-16 md:flex-row md:items-stretch">
        {/* LEFT: Text */}
        <div className="w-full md:w-1/2">
          <p className="mb-3 text-sm font-medium text-violet-500">
            Sell once • Earn many times
          </p>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Turn your photos into{" "}
            <span className="text-violet-600">income.</span>
          </h1>

          <p className="mb-6 max-w-xl text-base leading-relaxed text-slate-600">
            Architects, designers, bloggers, marketing agencies and businesses
            buy licensed images from Picsellart. You upload once — we handle
            secure checkout and instant downloads.
          </p>

          <ul className="mb-8 space-y-2 text-sm text-slate-700">
            <li>• Set your own price within your selected seller plan.</li>
            <li>
              • Picsellart watermark on previews — clean, full-resolution file
              after purchase.
            </li>
            <li>• Track views, sales and earnings from your dashboard.</li>
          </ul>

          <div className="flex flex-wrap gap-3">
            {/* These hrefs assume your existing routes. 
                If your buyer/seller login URLs are different, only these links need changing. */}
            <a
              href="/buyer-login"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Buyer Login
            </a>

            <a
              href="/seller-login"
              className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-300 hover:bg-violet-700"
            >
              Become a Seller
            </a>

            <a
              href="/explore"
              className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Explore Pictures
            </a>
          </div>
        </div>

        {/* RIGHT: Image collage */}
        <div className="w-full md:w-1/2">
          <div className="mx-auto grid max-w-md grid-cols-2 gap-4 rounded-3xl bg-slate-900/5 p-4 shadow-lg">
            {heroImages.map((src, index) => (
              <div
                key={src}
                className={`overflow-hidden rounded-2xl bg-slate-200 shadow-md ${
                  index === 0 ? "row-span-2 h-64" : "h-32"
                }`}
              >
                <img
                  src={src}
                  alt="Picsellart sample"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">
            Sample previews with Picsellart watermark. Final downloads are
            clean, high-resolution files.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;
