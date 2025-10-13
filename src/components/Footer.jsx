export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between text-sm text-gray-600">
        <span>© {new Date().getFullYear()} Picsellart</span>
        <div className="flex gap-4">
          <a href="/faq">FAQ</a>
          <a href="/refund">Refund Policy</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  )
}
