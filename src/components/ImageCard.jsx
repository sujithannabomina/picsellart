import { Link } from 'react-router-dom'


export default function ImageCard({ photo }) {
return (
<div className="bg-white border rounded-xl overflow-hidden">
<Link to={`/photo/${photo.id}`}>
<img src={photo.url} alt={photo.title} className="w-full h-56 object-cover" loading="lazy" />
</Link>
<div className="p-3">
<div className="text-sm text-gray-500">{photo.tags?.join(', ')}</div>
<div className="flex items-center justify-between">
<h3 className="font-medium">{photo.title}</h3>
{photo.price != null && <div className="font-semibold">₹{(photo.price/100).toFixed(2)}</div>}
</div>
</div>
</div>
)
}