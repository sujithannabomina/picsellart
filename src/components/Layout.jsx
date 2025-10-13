import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <Header key={`header-${pathname}`} />
      <main className="min-h-[60vh]">{/* your existing page content renders here */}<Outlet /></main>
      <Footer key={`footer-${pathname}`} />
    </>
  )
}
