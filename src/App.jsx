// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MillLayout from './MillComponents/MillLayout.jsx';

function App() {
  return (
    <Router>
      {/* All routes handled inside MillLayout */}
      <Routes>
        <Route path="/*" element={<MillLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
