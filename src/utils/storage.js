import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

// Local fallback images (only used if Firestore has no data)
const FALLBACK_LOCAL_SAMPLES = [
  '/images/sample1.jpg',
  '/images/sample2.jpg',
  '/images/sample3.jpg',
  '/images/sample4.jpg',
  '/images/sample5.jpg',
  '/images/sample6.jpg',
]

// Default price for samples if not provided (₹199)
const SAMPLE_PRICE_FALLBACK = 19900

// --- Firestore: SAMPLES -------------------------------------------------
export async function loadSamplePhotos() {
  try {
    // No orderBy to avoid failures when createdAt is missing on some docs
    const snap = await getDocs(collection(db, 'samples'))
    const items = snap.docs.map((d) => {
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

    // If Firestore has no samples, fall back to local public images
    if (items.length === 0) {
      return FALLBACK_LOCAL_SAMPLES.map((url, i) => ({
        id: `sample-${i + 1}`,
        url,
        title: 'Street Photography',
        tags: ['street', 'sample'],
        price: SAMPLE_PRICE_FALLBACK,
        sellerId: 'picsellart',
        createdAt: null,
      }))
    }

    return items
  } catch (e) {
    console.error('loadSamplePhotos() failed:', e)
    // Last-resort fallback so the page isn’t empty
    return FALLBACK_LOCAL_SAMPLES.map((url, i) => ({
      id: `sample-${i + 1}`,
      url,
      title: 'Street Photography',
      tags: ['street', 'sample'],
      price: SAMPLE_PRICE_FALLBACK,
      sellerId: 'picsellart',
      createdAt: null,
    }))
  }
}

// --- Firestore: SELLER UPLOADS -----------------------------------------
export async function loadSellerPhotos() {
  try {
    const snap = await getDocs(collection(db, 'photos'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('loadSellerPhotos() failed:', e)
    return []
  }
}
