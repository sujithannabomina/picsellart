import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-dvh bg-slate-100">
      <Header />
      <main className="max-w-[1200px] mx-auto px-5 py-8">{children}</main>
    </div>
  );
}
