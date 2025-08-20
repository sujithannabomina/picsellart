import Header from './Header'

export default function Page({ title, children }) {
  return (
    <>
      <Header />
      <main className="container-p py-8">
        {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
        {children}
      </main>
      <footer className="mt-16 border-t">
        <div className="container-p py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Picsellart
        </div>
      </footer>
    </>
  )
}
