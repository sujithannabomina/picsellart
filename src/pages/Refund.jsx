import Page from '../components/Page'
import { Link } from 'react-router-dom'


export default function Refund() {
return (
<Page title="Refund Policy">
<div className="prose max-w-none">
<p>Refunds are considered for duplicate purchases, technical payment errors, or cases where access was not delivered after a valid payment.</p>
<h2>Eligibility</h2>
<ul>
<li>Duplicate charges for the same order.</li>
<li>Payment captured but download access not delivered.</li>
<li>Unauthorized transactions reported promptly.</li>
</ul>
<h2>How to Request</h2>
<p>Submit your request via the <Link to="/contact" className="underline">Contact</Link> page with order ID, payment reference, and reason.</p>
<h2>Processing Time</h2>
<p><strong>Refund reaches within 3 business days of processing</strong> (bank/card network timelines may vary).</p>
<h2>Non-Refundable</h2>
<ul>
<li>Content already downloaded and used contrary to license.</li>
<li>Buyer’s remorse without a qualifying issue.</li>
<li>Abuse of the platform or policy.</li>
</ul>
<p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
</div>
</Page>
)
}