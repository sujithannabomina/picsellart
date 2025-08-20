import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

// Default price in paise if a sample doc doesn't include it (₹199)
const SAMPLE_PRICE_FALLBACK = 19900

// Load sample photos from Firestore: collection "samples"
// Expected fields per doc: { url, title, tags, price (paise), sellerId? }
// We default: title="Street Photography", tags=["street","sample"],
// price=SAMPLE_PRICE_FALLBACK, sellerId="picsellart"
export async function loadSamplePhotos() {
  try {
    const q = query(collection(db, 'samples'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    const items = snap.docs.map(d => {
      const data = d.data() || {}
      return {
        id: d.id,
        url: data.url,
        title: data.title || 'Street Photography',
        tags: Array.isArray(data.tags) ? data.tags : ['street', 'sample'],
        price: typeof data.price === 'number' ? data.price : SAMPLE_PRICE_FALLBACK,
        sellerId: data.sellerId || 'picsellart',
        createdAt: data.createdAt || null,
      }
    })
    return items
  } catch (e) {
    console.error('loadSamplePhotos() failed:', e)
    return []
  }
}

// Load seller-uploaded photos from Firestore: collection "photos"
export async function loadSellerPhotos() {
  try {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('loadSellerPhotos() failed:', e)
    return []
  }
}
