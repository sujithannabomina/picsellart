import { Routes, Route, Navigate, useLocation } from 'react-router-dom'


import BuyerLogin from './pages/BuyerLogin'
import BuyerDashboard from './pages/BuyerDashboard'


import SellerStart from './pages/SellerStart'
import SellerLogin from './pages/SellerLogin'
import SellerOnboarding from './pages/SellerOnboarding'
import SellerDashboard from './pages/SellerDashboard'


import Faq from './pages/Faq'
import Refund from './pages/Refund'
import Contact from './pages/Contact'


function RequireAuth({ children, role }) {
const { user, profile, loading } = useAuth()
const location = useLocation()
if (loading) return null
if (!user) return <Navigate to={role === 'seller' ? '/seller/login' : '/buyer/login'} state={{ from: location }} replace />
if (role && profile?.role !== role) return <Navigate to="/" replace />
return children
}


export default function App() {
return (
<AuthProvider>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/explore" element={<Explore />} />
<Route path="/photo/:photoId" element={<PhotoDetails />} />


{/* Buyer flow */}
<Route path="/buyer/login" element={<BuyerLogin />} />
<Route path="/buyer/dashboard" element={
<RequireAuth role="buyer"><BuyerDashboard /></RequireAuth>
} />


{/* Seller flow */}
<Route path="/seller/start" element={<SellerStart />} />
<Route path="/seller/login" element={<SellerLogin />} />
<Route path="/seller/onboarding" element={
<RequireAuth role="seller"><SellerOnboarding /></RequireAuth>
} />
<Route path="/seller/dashboard" element={
<RequireAuth role="seller"><SellerDashboard /></RequireAuth>
} />


{/* Static/support pages */}
<Route path="/faq" element={<Faq />} />
<Route path="/refund" element={<Refund />} />
<Route path="/contact" element={<Contact />} />


<Route path="*" element={<LandingPage />} />
</Routes>
</AuthProvider>
)
}