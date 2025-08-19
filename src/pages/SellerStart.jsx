import Page from '../components/Page'
import { Link } from 'react-router-dom'


export default function SellerStart() {
return (
<Page title="Become a Seller">
<div className="max-w-2xl bg-white border rounded-xl p-6">
<p className="text-gray-700">Start by logging in as a seller. You'll complete a short profile and pay a one-time registration fee. After that, you'll get access to your Seller Dashboard.</p>
<Link to="/seller/login" className="mt-4 inline-block px-5 py-3 rounded-xl bg-gray-900 text-white">Start Selling</Link>
</div>
</Page>
)
}