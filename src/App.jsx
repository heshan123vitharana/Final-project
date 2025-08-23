import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MillLayout from './MillComponents/MillLayout.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* All Mill routes handled inside MillLayout */}
        <Route path="/*" element={<MillLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
