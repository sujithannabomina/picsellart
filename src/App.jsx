import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'

// Lazy route components — code-split without top-level await
const Landing      = lazy(() => import('./pages/LandingPage.jsx'))
const Explore      = lazy(() => import('./pages/Explore.jsx'))
const Faq          = lazy(() => import('./pages/Faq.jsx'))
const Refund       = lazy(() => import('./pages/Refund.jsx'))
const Contact      = lazy(() => import('./pages/Contact.jsx'))
const BuyerLogin   = lazy(() => import('./pages/BuyerLogin.jsx'))
const SellerLogin  = lazy(() => import('./pages/SellerLogin.jsx'))
const BuyerDash    = lazy(() => import('./pages/BuyerDashboard.jsx'))
const SellerDash   = lazy(() => import('./pages/SellerDashboard.jsx'))
const SellerPlan   = lazy(() => import('./pages/SellerPlan.jsx'))
const SellerRenew  = lazy(() => import('./pages/SellerRenew.jsx'))
const PhotoDetails = lazy(() => import('./pages/PhotoDetails.jsx'))

function Fallback() {
  return (
    <main className="section container">
      <p>Loading…</p>
    </main>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/seller/login" element={<SellerLogin />} />

          <Route path="/buyer/dashboard" element={<BuyerDash />} />
          <Route path="/seller/dashboard" element={<SellerDash />} />
          <Route path="/seller/plan" element={<SellerPlan />} />
          <Route path="/seller/renew" element={<SellerRenew />} />

          <Route path="/photo/:id" element={<PhotoDetails />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
