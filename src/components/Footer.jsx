import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
        <p className="text-sm text-slate-600">© {new Date().getFullYear()} Picsellart</p>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/faq" className="hover:underline">FAQ</Link>
          <Link to="/refund" className="hover:underline">Refund Policy</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
