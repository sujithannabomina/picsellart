import Page from '../components/Page'
import { Link } from 'react-router-dom'

const CANDIDATES = [
  '/images/hero1.jpg','/images/hero2.jpg','/images/hero3.jpg',
  '/images/hero4.jpg','/images/hero5.jpg','/images/hero6.jpg',
  '/images/sample1.jpg','/images/sample2.jpg','/images/sample3.jpg',
  '/images/sample4.jpg','/images/sample5.jpg','/images/sample6.jpg',
]
const FALLBACKS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',
]
function pickThree(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a.slice(0,3)}
function ImageWithFallback({src,alt,idx}) {
  const onError = (e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=FALLBACKS[idx%FALLBACKS.length] }
  return (
    <div className="relative group">
      <img src={src} alt={alt} onError={onError}
        className="w-full h-56 md:h-64 object-cover rounded-3xl border border-gray-200 shadow-lg ring-1 ring-black/5 group-hover:scale-[1.01] transition-transform" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10"></div>
    </div>
  )
}

export default function LandingPage(){
  const chosen = pickThree(CANDIDATES)
  return (
    <Page>
      <section className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <img src="/logo.png" alt="Picsellart" className="h-12 w-12 rounded" />
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Picsellart</h1>
        </div>
        {/* New value prop aimed at subscriptions */}
        <p className="mt-2 text-gray-600">
          Turn your photos into income — join as a seller, upload in minutes, and start earning.
        </p>

        {/* Buttons: stack on mobile, no overlap */}
        <div className="mt-6 grid grid-cols-1 sm:inline-flex gap-3 justify-center">
          <Link to="/buyer/login" className="btn btn-primary w-full sm:w-auto">Buyer Login</Link>
          <Link to="/seller/start" className="btn bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">Become a Seller</Link>
          <Link to="/explore" className="btn btn-outline w-full sm:w-auto">Explore Pictures</Link>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {chosen.map((src,i)=>(<ImageWithFallback key={i} src={src} alt={`Homepage ${i+1}`} idx={i} />))}
      </section>

      {/* Simple seller plans preview */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold text-center mb-6">Choose a Seller Plan</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5">
            <div className="text-xl font-semibold">Starter</div>
            <div className="text-3xl font-bold mt-1">₹499.00</div>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              <li>Up to 100 uploads</li><li>Basic analytics</li>
            </ul>
            <Link to="/seller/start" className="btn bg-blue-600 text-white hover:bg-blue-700 mt-4">Get Starter</Link>
          </div>
          <div className="card p-5">
            <div className="text-xl font-semibold">Pro</div>
            <div className="text-3xl font-bold mt-1">₹999.00</div>
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              <li>Unlimited uploads</li><li>Advanced analytics</li><li>Priority support</li>
            </ul>
            <Link to="/seller/start" className="btn bg-blue-600 text-white hover:bg-blue-700 mt-4">Go Pro</Link>
          </div>
        </div>
      </section>
    </Page>
  )
}
