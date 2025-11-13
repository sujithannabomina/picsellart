import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="text-center py-16">
      <h1 className="text-5xl font-extrabold mb-3">Not Found</h1>
      <p className="text-slate-600 mb-6">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold">
        Go Home
      </Link>
    </section>
  );
}
