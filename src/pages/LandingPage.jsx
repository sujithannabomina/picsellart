import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">Picsellart</h1>
        <p className="mt-4 text-lg text-slate-600">
          Turn your photos into income — architects, designers, models and artists upload here and earn.
          Blogs, web designers, marketing agencies and businesses buy licensed images from Picsellart.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/buyer/login" className="bg-slate-900 text-white px-5 py-3 rounded-lg">Buyer Login</Link>
          <Link to="/seller/login" className="bg-indigo-600 text-white px-5 py-3 rounded-lg">Become a Seller</Link>
          <Link to="/explore" className="bg-violet-600 text-white px-5 py-3 rounded-lg">Explore Pictures</Link>
        </div>
      </div>

      {/* Showcase row (static images kept minimal) */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-3xl overflow-hidden shadow-md">
            <img src={`https://picsum.photos/seed/picsellart-${i}/1200/800`} alt="" className="w-full h-64 object-cover"/>
          </div>
        ))}
      </div>
    </div>
  )
}
