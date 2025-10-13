import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages (use EXACT filenames you have on disk)
import LandingPage from './pages/LandingPage.jsx';
import Explore from './pages/Explore.jsx';
import Faq from './pages/Faq.jsx';
import Refund from './pages/Refund.jsx';
import Contact from './pages/Contact.jsx';
import PhotoDetails from './pages/PhotoDetails.jsx';
import License from './pages/License.jsx';

import SellerLogin from './pages/SellerLogin.jsx';
import SellerStart from './pages/SellerStart.jsx';
import SellerSubscribe from './pages/SellerSubscribe.jsx';
import SellerOnboarding from './pages/SellerOnboarding.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';

import BuyerLogin from './pages/BuyerLogin.jsx';
import BuyerDashboard from './pages/BuyerDashboard.jsx';

// Tiny error boundary so a bug won’t blank the page
class AppBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(err, info) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', err, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui' }}>
          <h2 style={{ marginBottom: 8 }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#111827', color: '#f9fafb', padding: 12, borderRadius: 8 }}>
{String(this.state.error && this.state.error.message || this.state.error)}
          </pre>
          <p style={{ marginTop: 8, color: '#6b7280' }}>
            Check the browser Console for details. The rest of the app stayed up so you’re not stuck on a blank screen.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppBoundary>
      <Header />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/license" element={<License />} />
        <Route path="/photo/:id" element={<PhotoDetails />} />

        {/* Auth – Seller */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/start" element={<SellerStart />} />
        <Route path="/seller/subscribe" element={<SellerSubscribe />} />
        <Route path="/seller/onboarding" element={<ProtectedRoute role="seller"><SellerOnboarding /></ProtectedRoute>} />
        <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />

        {/* Auth – Buyer */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/dashboard" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </AppBoundary>
  );
}
