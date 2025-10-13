export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} Picsellart</p>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/faq" className="hover:underline">FAQ</a>
          <a href="/refund" className="hover:underline">Refund Policy</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
