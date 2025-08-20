import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

// ---- Sample photos (local public/ images) ------------------------------
// Give every sample a price & a synthetic seller so they behave like real items.
const SAMPLE_FILES = [
  '/images/sample1.jpg',
  '/images/sample2.jpg',
  '/images/sample3.jpg',
  '/images/sample4.jpg',
  '/images/sample5.jpg',
  '/images/sample6.jpg',
]

// default sample price (₹199)
const SAMPLE_PRICE = 19900 // paise

export async function loadSamplePhotos() {
  // Build an array with ids like sample-1, sample-2, ...
  const out = SAMPLE_FILES.map((url, i) => ({
    id: `sample-${i + 1}`,
    url,
    title: 'Street Photography',
    tags: ['street', 'sample'],
    // Treat samples as Picsellart-owned items that can be bought
    price: SAMPLE_PRICE,
    sellerId: 'picsellart',
  }))
  return out
}

// ---- Seller photos from Firestore --------------------------------------
export async function loadSellerPhotos() {
  const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
