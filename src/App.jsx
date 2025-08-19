// Import React Router components for client-side routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import sidebar and page components
import Sidebar from './Components/Sidebar';
import Home from './Pages/Home';
import MillRegistration from './Pages/MillRegistration';
import UpdateStock from './Pages/UpdateStock';
import ViewStock from './Pages/ViewStock';
import PaddyPrice from './Pages/PaddyPrice';
import Payment from './Pages/Payment';
import Profile from './Pages/Profile';
import Notifications from './pages/Notifications';

// Main App component: sets up layout and routing
function App() {
  return (
    // Router enables navigation between pages without reloading
    <Router>
      {/* Flex container for sidebar and main content */}
      <div className="flex min-h-screen">
        {/* Sidebar navigation (always visible) */}
        <Sidebar />
        {/* Main content area where routed pages are displayed */}
        <main className="flex-grow bg-gray-50 p-6 md:p-8 lg:p-10 overflow-y-auto">
          {/* Define routes for each page */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<MillRegistration />} />
            <Route path="/update-stock" element={<UpdateStock />} />
            <Route path="/view-stock" element={<ViewStock />} />
            <Route path="/paddy-price" element={<PaddyPrice />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;