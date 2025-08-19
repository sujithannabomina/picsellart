import { Link } from 'react-router-dom'


export default function Footer() {
return (
<footer className="w-full border-t bg-white mt-12">
<div className="max-w-6xl mx-auto px-4 py-6 text-sm flex flex-wrap gap-4 items-center justify-between">
<p className="text-gray-500">© {new Date().getFullYear()} Picsellart</p>
<nav className="flex gap-4">
<Link to="/faq" className="hover:underline">FAQ</Link>
<Link to="/refund" className="hover:underline">Refund Policy</Link>
<Link to="/contact" className="hover:underline">Contact</Link>
</nav>
</div>
</footer>
)
}