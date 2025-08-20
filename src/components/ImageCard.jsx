import { Link } from 'react-router-dom'

export default function ImageCard({ photo }) {
  return (
    <div className="card overflow-hidden">
      <Link to={`/photo/${photo.id}`}>
        <img src={photo.url} alt={photo.title} className="w-full h-56 object-cover" loading="lazy" />
      </Link>
      <div className="p-3">
        <div className="font-medium">{photo.title || 'Street Photography'}</div>
        <div className="text-xs text-gray-500 truncate">{photo.tags?.join(', ')}</div>
        {photo.price ? (
          <div className="mt-2 font-semibold">₹{(photo.price / 100).toFixed(2)}</div>
        ) : null}
      </div>
    </div>
  )
}
