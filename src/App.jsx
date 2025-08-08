import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
// ... import other pages

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      {/* Add other routes here */}
    </Routes>
  );
}

export default App;
