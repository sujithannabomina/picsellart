export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between text-sm text-gray-600">
        <div>© 2025 Picsellart</div>
        <div className="flex gap-4">
          <a href="/faq" className="hover:underline">FAQ</a>
          <a href="/refund" className="hover:underline">Refund Policy</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  )
}
