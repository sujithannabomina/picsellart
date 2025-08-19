import { storage, db } from '../firebase'
import { listAll, ref, getDownloadURL } from 'firebase/storage'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'


// Loads 112 sample images from Firebase Storage path: public/images/
export async function loadSamplePhotos() {
const baseRef = ref(storage, 'public/images')
const list = await listAll(baseRef)
const files = list.items
.filter(it => /sample(\d+)\.jpg$/i.test(it.name))
.sort((a,b) => a.name.localeCompare(b.name))
const urls = await Promise.all(files.map(getDownloadURL))
return urls.map((url, i) => ({
id: `sample-${i+1}`,
url,
title: 'Street Photography',
tags: ['street','sample'],
price: null, // Samples shown in Explore but not purchasable
type: 'sample',
}))
}


// Loads seller-uploaded photos with metadata from Firestore `photos`
export async function loadSellerPhotos() {
const q = query(collection(db, 'photos'), orderBy('createdAt','desc'))
const snap = await getDocs(q)
const results = []
for (const docSnap of snap.docs) {
const d = docSnap.data()
results.push({ id: docSnap.id, ...d })
}
return results
}