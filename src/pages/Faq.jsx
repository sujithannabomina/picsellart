import { useState } from 'react'
import Page from '../components/Page'


const faqs = [
{ q: 'What is Picsellart?', a: 'Picsellart is a marketplace to buy high-quality photos and sell your own work to buyers.' },
{ q: 'How do I become a seller?', a: 'Use the Seller Login to register. After verification and a one-time fee, you can upload images and set prices.' },
{ q: 'What file types do you support?', a: 'We currently support JPG and PNG. More formats will be added.' },
{ q: 'How are images delivered to buyers?', a: 'After successful payment, buyers get instant download access.' },
{ q: 'What is your refund policy?', a: 'Refunds are available for duplicate purchases or payment errors as per our Refund Policy page.' },
{ q: 'How are seller earnings paid out?', a: 'Earnings are settled to the seller’s bank account as per the settlement cycle.' },
{ q: 'Who do I contact for support?', a: 'Use the Contact page to reach support. We reply within 24–48 hours.' },
]


export default function Faq() {
const [open, setOpen] = useState(null)
return (
<Page title="Frequently Asked Questions">
<div className="space-y-3">
{faqs.map((item, idx) => (
<div key={idx} className="bg-white border rounded-xl">
<button type="button" className="w-full text-left px-4 py-3 flex items-center justify-between" onClick={()=>setOpen(open===idx?null:idx)}>
<span className="font-medium">{item.q}</span>
<span className="text-gray-500">{open===idx?'−':'+'}</span>
</button>
{open===idx && <div className="px-4 pb-4 text-gray-700">{item.a}</div>}
</div>
))}
</div>
</Page>
)
}