import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import LandingPage from "../pages/LandingPage";
import Explore from "../pages/Explore";
import BuyerLogin from "../pages/BuyerLogin";
import SellerLogin from "../pages/SellerLogin";
import SellerDashboard from "../pages/SellerDashboard";
import SellerSubscribe from "../pages/SellerSubscribe";
import PhotoDetails from "../pages/PhotoDetails";
import Faq from "../pages/Faq";
import Contact from "../pages/Contact";
import Refunds from "../pages/Refunds";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/photo/:id" element={<PhotoDetails/>} />
        <Route path="/buyer" element={<BuyerLogin/>} />
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute need="buyer">
            <div className="container"><h1>Buyer Dashboard</h1></div>
          </ProtectedRoute>
        }/>
        <Route path="/seller" element={<SellerLogin/>} />
        <Route path="/seller/dashboard" element={<SellerDashboard/>} />
        <Route path="/seller/subscribe" element={<SellerSubscribe/>} />
        <Route path="/faq" element={<Faq/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/refunds" element={<Refunds/>} />
        <Route path="*" element={<div className="container"><h2>Not Found</h2></div>} />
      </Routes>
    </BrowserRouter>
  )
}
