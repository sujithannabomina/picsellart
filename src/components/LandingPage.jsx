import { Link } from "react-router-dom";

// public/images contains sample1.jpg ... sample6.jpg
const PUBLIC_IMAGES = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
  "/images/sample5.jpg",
  "/images/sample6.jpg",
];

function pickThree() {
  const pool = [...PUBLIC_IMAGES];
  const out = [];
  while (out.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

export default function LandingPage() {
  const picks = pickThree();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-center text-5xl font-extrabold tracking-tight text-gray-900">
        Picsellart
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
        Turn your photos into income. Sellers upload and earn; buyers get
        licensed, instant downloads.
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Link
          to="/buyer/login"
          className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
        >
          Buyer Login
        </Link>
        <Link
          to="/seller/login"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Become a Seller
        </Link>
        <Link
          to="/explore"
          className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
        >
          Explore Pictures
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {picks.map((src) => (
          <div
            key={src}
            className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm"
          >
            <img
              src={src}
              alt="Sample"
              className="h-64 w-full object-cover"
              loading="eager"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
