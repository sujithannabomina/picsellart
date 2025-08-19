import Page from '../components/Page'
import { Link } from 'react-router-dom'

// Candidate sources from /public/images (if present).
// We’ll pick 3 at runtime, and each image has a built-in fallback to a
// high-quality Unsplash image if the local file doesn’t exist.
const CANDIDATES = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
  '/images/hero4.jpg',
  '/images/hero5.jpg',
  '/images/hero6.jpg',
  '/images/sample1.jpg',
  '/images/sample2.jpg',
  '/images/sample3.jpg',
  '/images/sample4.jpg',
  '/images/sample5.jpg',
  '/images/sample6.jpg',
]

// A few neutral, photography-themed fallbacks.
const FALLBACKS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',
  'https://images.unsplash.com/photo-1499084732479-de2c02d45fc4',
  'https://images.unsplash.com/photo-1482192505345-5655af888cc4',
]

function pickThree(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, 3)
}

function ImageWithFallback({ src, alt, idx }) {
  const handleError = (e) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = FALLBACKS[idx % FALLBACKS.length]
  }
  return (
    <div className="relative group">
      {/* Attractive framing */}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        loading="eager"
        className="w-full h-56 md:h-64 object-cover rounded-3xl border border-gray-200 shadow-lg ring-1 ring-black/5 group-hover:scale-[1.01] transition-transform"
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10"></div>
    </div>
  )
}

export default function LandingPage() {
  const chosen = pickThree(CANDIDATES)

  return (
    <Page>
      {/* Hero with logo + slogan */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <img src="/logo.png" alt="Picsellart" className="h-12 w-12 rounded" />
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Picsellart</h1>
        </div>
        <p className="mt-2 text-gray-600">Buy &amp; Sell Stunning Street Photography</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/buyer/login" className="px-5 py-3 rounded-xl bg-gray-900 text-white">Buyer Login</Link>
          <Link to="/seller/start" className="px-5 py-3 rounded-xl border">Become a Seller</Link>
          <Link to="/explore" className="px-5 py-3 rounded-xl border">Explore Pictures</Link>
        </div>
      </section>

      {/* 3 images (auto-picks from public/images or falls back) */}
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {chosen.map((src, i) => (
          <ImageWithFallback key={i} src={src} alt={`Homepage showcase ${i + 1}`} idx={i} />
        ))}
      </section>
    </Page>
  )
}
