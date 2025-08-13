// src/App.jsx  (snippet)
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import SellPage from "./pages/SellPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* simple nav */}
      <nav style={{ padding: "6px 8px", borderBottom: "1px solid #e5e7eb" }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        <Link to="/explore" style={{ marginRight: 12 }}>Explore</Link>
        <Link to="/sell">Sell</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/sell" element={<SellPage />} />
      </Routes>
    </BrowserRouter>
  );
}
