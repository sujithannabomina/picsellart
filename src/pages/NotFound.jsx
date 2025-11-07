// src/pages/NotFound.jsx
import Header from "../components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-5xl font-extrabold text-slate-900">Not Found</h1>
        <p className="mt-3 text-slate-700">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="mt-6 inline-block px-4 py-2 rounded-md border">
          Go Home
        </a>
      </main>
    </>
  );
}
