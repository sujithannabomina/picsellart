// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

// pages
import LandingPage from '../pages/LandingPage';
import Explore from '../pages/Explore';
import PhotoDetails from '../pages/PhotoDetails';
import FAQ from '../pages/FAQ';
import Contact from '../pages/Contact';
import Refund from '../pages/Refund';

import BuyerLogin from '../pages/BuyerLogin';
import SellerLogin from '../pages/SellerLogin';
import SellerDashboard from '../pages/SellerDashboard';
import SellerSubscribe from '../pages/SellerSubscribe';

// Note: keep names/cases exactly as files on disk to avoid Vite case issues.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'explore', element: <Explore /> },
      { path: 'photo/:id', element: <PhotoDetails /> },

      { path: 'faq', element: <FAQ /> },
      { path: 'contact', element: <Contact /> },
      { path: 'refund', element: <Refund /> },

      // auth short routes: immediately open Google and redirect
      { path: 'buyer', element: <BuyerLogin /> },
      { path: 'seller', element: <SellerLogin /> },

      // seller area
      { path: 'seller/dashboard', element: <SellerDashboard /> },
      { path: 'seller/subscribe', element: <SellerSubscribe /> },
    ],
  },
]);
