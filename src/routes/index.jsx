// src/routes/index.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import LandingPage from "../pages/LandingPage";
import Explore from "../pages/Explore";
import Faq from "../pages/Faq";
import BuyerLogin from "../pages/BuyerLogin";
import SellerLogin from "../pages/SellerLogin";
import BuyerDashboard from "../pages/BuyerDashboard";
import SellerPlan from "../pages/SellerPlan";
import SellerRenew from "../pages/SellerRenew";
import Refund from "../pages/Refund";
import Contact from "../pages/Contact";
// PhotoDetails already exists in your repo:
import PhotoDetails from "../pages/PhotoDetails";

export default function AppRoutes(){
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/explore" element={<Explore/>}/>
        <Route path="/faq" element={<Faq/>}/>
        <Route path="/refund" element={<Refund/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/buyer/login" element={<BuyerLogin/>}/>
        <Route path="/seller/login" element={<SellerLogin/>}/>
        <Route path="/buyer/dashboard" element={<BuyerDashboard/>}/>
        <Route path="/seller/plan" element={<SellerPlan/>}/>
        <Route path="/seller/renew" element={<SellerRenew/>}/>
        <Route path="/photo/:id" element={<PhotoDetails/>}/>
        <Route path="*" element={<div className="container"><h1 className="h1">Not found</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}
