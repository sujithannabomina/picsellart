import { useEffect, useState } from 'react'
import Page from '../components/Page'
import ImageCard from '../components/ImageCard'
import { loadSamplePhotos, loadSellerPhotos } from '../utils/storage'


export default function Explore() {
const [photos, setPhotos] = useState([])
const [loading, setLoading] = useState(true)


useEffect(() => {
(async () => {
const [samples, sellers] = await Promise.all([
loadSamplePhotos(),
loadSellerPhotos(),
])
// Merge with seller photos first, then samples (or shuffle if preferred)
setPhotos([ ...sellers, ...samples ])
setLoading(false)
})()
}, [])


return (
<Page title="Explore Pictures">
{loading ? (
<div>Loading...</div>
) : (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
{photos.map(p => <ImageCard key={p.id} photo={p} />)}
</div>
)}
</Page>
)
}