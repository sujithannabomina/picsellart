// /src/routes/index.jsx
import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Lazy-load pages to keep the main bundle smaller
const LandingPage   = lazy(() => import("../pages/LandingPage"));
const Explore       = lazy(() => import("../pages/Explore"));
const BuyerLogin    = lazy(() => import("../pages/BuyerLogin"));
const SellerLogin   = lazy(() => import("../pages/SellerLogin"));
// If you already have these static pages in /src/pages, the routes below will work:
const FAQ           = lazy(() => import("../pages/FAQ"));       // (keep your existing content)
const Contact       = lazy(() => import("../pages/Contact"));   // (keep your existing content)
const Refund        = lazy(() => import("../pages/Refund"));    // (more professional copy per your plan)

// Simple top nav
function Header() {
  const { user, role, logout } = useAuth() || {};
  const active =
    "rounded-xl bg-slate-100 px-4 py-2 font-medium text-slate-900";
  const base =
    "rounded-xl px-4 py-2 font-medium text-slate-700 hover:bg-slate-100";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          {/* Use your public/logo.* file (exists in repo) */}
          <img src="/logo.png" alt="Picsellart" className="h-7 w-7 rounded" />
          <span className="font-semibold tracking-tight">Picsellart</span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          <NavLink to="/explore" className={({isActive}) => isActive ? active : base}>Explore</NavLink>
          <NavLink to="/faq" className={({isActive}) => isActive ? active : base}>FAQ</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? active : base}>Contact</NavLink>
          <NavLink to="/refund" className={({isActive}) => isActive ? active : base}>Refunds</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/buyer-login" className="btn-pill">Buyer Login</Link>
          <Link to="/seller-login" className="btn-pill">Seller Login</Link>
          <Link to="/start-selling" className="btn-primary">Start Selling</Link>
          {user && (
            <button onClick={logout} className="btn-ghost hidden md:inline-flex">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// Optional guard for seller-only areas (dashboard, etc.)
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/seller-login" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {children}
      </div>
      <footer className="mt-16 border-t py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Picsellart. All rights reserved.
      </footer>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Keep Suspense high so lazy pages show a consistent loader */}
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center text-slate-600">
              Loading…
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <LandingPage />
                </Layout>
              }
            />
            <Route
              path="/explore"
              element={
                <Layout>
                  <Explore />
                </Layout>
              }
            />
            <Route
              path="/buyer-login"
              element={
                <Layout>
                  <BuyerLogin />
                </Layout>
              }
            />
            <Route
              path="/seller-login"
              element={
                <Layout>
                  <SellerLogin />
                </Layout>
              }
            />
            {/* Keep this route pointing at your seller area or subscribe page */}
            <Route
              path="/start-selling"
              element={
                <Layout>
                  {/* If you have a dedicated component (SellerSubscribe or Dashboard), wrap with RequireAuth */}
                  {/* <RequireAuth><SellerDashboard /></RequireAuth> */}
                  <SellerLogin />
                </Layout>
              }
            />

            {/* Static pages (no License route, per your instruction) */}
            <Route
              path="/faq"
              element={
                <Layout>
                  <FAQ />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />
            <Route
              path="/refund"
              element={
                <Layout>
                  <Refund />
                </Layout>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <Layout>
                  <div className="py-20 text-center">
                    <h1 className="text-3xl font-bold">Page not found</h1>
                    <p className="mt-2 text-slate-600">
                      The page you’re looking for doesn’t exist.
                    </p>
                    <Link to="/" className="btn-primary mt-6 inline-flex">Go Home</Link>
                  </div>
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
