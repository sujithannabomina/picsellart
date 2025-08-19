import { useEffect, useState } from 'react'
return
}


// Create order via serverless
const res = await fetch('/api/createOrder', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ amount: photo.price, receipt: `photo_${photo.id}_${Date.now()}` })
})
const { orderId } = await res.json()


const key = import.meta.env.VITE_RAZORPAY_KEY_ID
await openCheckout({
key,
amount: photo.price,
name: 'Picsellart',
description: photo.title,
orderId,
prefill: { email: user.email },
notes: { photoId: photo.id },
handler: async (resp) => {
// Verify on server
const v = await fetch('/api/verifyPayment', {
method: 'POST', headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ orderId, ...resp })
})
const { ok } = await v.json()
if (ok) {
await addDoc(collection(db, 'orders'), {
buyerId: user.uid,
photoId: photo.id,
amount: photo.price,
paymentId: resp.razorpay_payment_id,
createdAt: serverTimestamp(),
status: 'paid',
})
navigate('/buyer/dashboard')
}
}
})
}


if (loading || !photo) return <Page>Loading...</Page>


return (
<Page>
<div className="grid md:grid-cols-2 gap-6">
<img src={photo.url} alt={photo.title} className="w-full rounded-xl border" />
<div>
<h1 className="text-2xl font-semibold">{photo.title}</h1>
<div className="text-gray-500 mt-1">{photo.tags?.join(', ')}</div>
<div className="mt-4 text-3xl font-bold">₹{(photo.price/100).toFixed(2)}</div>
<button onClick={handleBuy} className="mt-6 px-5 py-3 rounded-xl bg-gray-900 text-white">Buy Now</button>
</div>
</div>
</Page>
)
}