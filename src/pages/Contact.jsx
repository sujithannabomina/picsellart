import Page from '../components/Page'


export default function Contact() {
return (
<Page title="Contact Us">
<div className="grid gap-6 md:grid-cols-2">
<div className="bg-white border rounded-xl p-4">
<h2 className="text-lg font-semibold mb-2">Support</h2>
<p className="text-gray-700">Questions about purchases, uploads, or your account? We typically respond within 24–48 hours.</p>
<ul className="mt-3 text-gray-700">
<li><span className="font-medium">Email:</span> support@picsellart.in</li>
<li><span className="font-medium">Hours:</span> Mon–Sat, 10:00–18:00 IST</li>
</ul>
</div>
<div className="bg-white border rounded-xl p-4">
<h2 className="text-lg font-semibold mb-2">Message</h2>
<form onSubmit={(e)=>{e.preventDefault(); alert('Thanks! Your message has been submitted.')}} className="space-y-3">
<input className="w-full border rounded-lg px-3 py-2" placeholder="Name" required />
<input type="email" className="w-full border rounded-lg px-3 py-2" placeholder="Email" required />
<textarea className="w-full border rounded-lg px-3 py-2 min-h-[120px]" placeholder="Message" required />
<button className="px-4 py-2 rounded-lg bg-gray-900 text-white">Send</button>
</form>
</div>
</div>
</Page>
)
}