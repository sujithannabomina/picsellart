// Loaders used by Explore:
// - Samples: read directly from Firebase Storage at /public/images (NO Firestore writes)
// - Seller uploads: read from Firestore "photos" (they already include metadata)

import { db, storage } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { ref, listAll, getDownloadURL } from 'firebase/storage'

// Price used for samples (₹199) in paise.
// You can change this if you want a different default.
const SAMPLE_PRICE_PAISE = 19900

// Build a stable ID from a storage path like "public/images/sample1.jpg"
function idFromPath(path) {
  // remove folders, extension -> e.g. "sample1"
  const base = path.split('/').pop() || ''
  return `sample-${base.replace(/\.[^.]+$/, '')}` // "sample-sample1"
}

// ---- SAMPLES: Read from Storage only (no Firestore needed) ------------------
export async function loadSamplePhotos() {
  try {
    // Your Storage rules already allow read under /public/images/**
    // (read = get + list), so listAll() will work.
    const folderRef = ref(storage, 'public/images')
    const listing = await listAll(folderRef)

    // Generate public download URLs and synthetic metadata for Explore
    const items = await Promise.all(
      listing.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef)
        const id = idFromPath(itemRef.fullPath)
        return {
          id,                       // stable id derived from filename
          url,                      // public URL from Storage
          title: 'Street Photography',
          tags: ['street', 'sample'],
          price: SAMPLE_PRICE_PAISE, // samples are purchasable like seller photos
          sellerId: 'picsellart',   // samples belong to Picsellart
          createdAt: null,
          // Note: storagePath retained in URL already; we use URL for previews/downloads
        }
      })
    )

    return items
  } catch (e) {
    console.error('loadSamplePhotos() failed:', e)
    return [] // fall back to nothing; Explore will still render seller uploads
  }
}

// ---- SELLER PHOTOS: Read from Firestore "photos" ---------------------------
export async function loadSellerPhotos() {
  try {
    const snap = await getDocs(collection(db, 'photos'))
    // Docs written by Seller Dashboard already include: { url, title, tags, price, sellerId, ... }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('loadSellerPhotos() failed:', e)
    return []
  }
}
