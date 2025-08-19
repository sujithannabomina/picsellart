import Header from './Header'
import Footer from './Footer'


export default function Page({ title, children }) {
return (
<div className="min-h-screen flex flex-col bg-gray-50">
<Header />
<main className="flex-1">
<div className="max-w-6xl mx-auto px-4 py-8">
{title && <h1 className="text-3xl font-semibold mb-6">{title}</h1>}
{children}
</div>
</main>
<Footer />
</div>
)
}