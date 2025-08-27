// Import necessary components from React Router
import { Routes, Route } from 'react-router-dom';

// Import the sidebar component for navigation
import MillSidebar from './MillSidebar.jsx';

// Import all page components for different routes
import MillHome from '../MillPages/MillHome.jsx';
import MillRegistration from '../MillPages/MillRegistration.jsx';
import MillUpdateStock from '../MillPages/MillUpdateStock.jsx';
import MillViewStock from '../MillPages/MillViewStock.jsx';
import MillPaddyPrice from '../MillPages/MillPaddyPrice.jsx';
import MillPayment from '../MillPages/MillPayment.jsx';
import MillProfile from '../MillPages/MillProfile.jsx';
import MillNotifications from '../MillPages/MillNotifications.jsx';
import MillLogout from '../MillPages/MillLogout.jsx';

// Main layout component for Mill section
const MillLayout = () => {
  return (
    // Flex container for sidebar and main content
    <div className="flex">
      {/* Sidebar navigation */}
      <MillSidebar />

      {/* Main content area */}
      <main className="flex-grow bg-gray-50 p-6 md:p-8 lg:p-10 overflow-y-auto">
        {/* Define all routes for Mill pages */}
        <Routes>
          <Route path="/" element={<MillHome />} /> {/* Home page */}
          <Route path="/register" element={<MillRegistration />} /> {/* Registration page */}
          <Route path="/update-stock" element={<MillUpdateStock />} /> {/* Update stock page */}
          <Route path="/view-stock" element={<MillViewStock />} /> {/* View stock page */}
          <Route path="/paddy-price" element={<MillPaddyPrice />} /> {/* Paddy price page */}
          <Route path="/payment" element={<MillPayment />} /> {/* Payment page */}
          <Route path="/profile" element={<MillProfile />} /> {/* Profile page */}
          <Route path="/notifications" element={<MillNotifications />} /> {/* Notifications page */}
          <Route path="/logout" element={<MillLogout />} /> {/* Logout page */}
        </Routes>
      </main>
    </div>
  );
};

export default MillLayout;