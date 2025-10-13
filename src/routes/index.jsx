import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

// your existing pages (keep your designs)
import LandingPage from '../pages/LandingPage'
import Explore from '../pages/Explore'
import Faq from '../pages/Faq'
import Refund from '../pages/Refund'
import Contact from '../pages/Contact'
import BuyerLogin from '../pages/BuyerLogin'
import SellerLogin from '../pages/SellerLogin'
import BuyerDashboard from '../pages/BuyerDashboard'
import SellerDashboard from '../pages/SellerDashboard'
import SellerStart from '../pages/SellerStart'
import SellerOnboarding from '../pages/SellerOnboarding'
import SellerSubscribe from '../pages/SellerSubscribe'
import PhotoDetails from '../pages/PhotoDetails'
import License from '../pages/License'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/explore', element: <Explore /> },
      { path: '/photo/:id', element: <PhotoDetails /> },
      { path: '/license', element: <License /> },

      // auth + dashboards
      { path: '/buyer/login', element: <BuyerLogin /> },
      { path: '/seller/login', element: <SellerLogin /> },
      { path: '/buyer/dashboard', element: <BuyerDashboard /> },
      { path: '/seller/dashboard', element: <SellerDashboard /> },

      // seller paywall flow
      { path: '/seller/start', element: <SellerStart /> },
      { path: '/seller/onboarding', element: <SellerOnboarding /> },
      { path: '/seller/subscribe', element: <SellerSubscribe /> },

      { path: '/faq', element: <Faq /> },
      { path: '/refund', element: <Refund /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
])
