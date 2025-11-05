import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Explore from "./pages/Explore";
import PhotoDetails from "./pages/PhotoDetails";
import Contact from "./pages/Contact";
import License from "./pages/License";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/photo/:name" element={<PhotoDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/license" element={<License />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
