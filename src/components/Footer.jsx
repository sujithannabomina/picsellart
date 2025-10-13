// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="max-w-6xl mx-auto py-10 px-4 flex items-center justify-between text-sm">
        <span>© 2025 Picsellart</span>
        <div className="flex gap-6">
          <Link to="/faq">FAQ</Link>
          <Link to="/refund">Refund Policy</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
