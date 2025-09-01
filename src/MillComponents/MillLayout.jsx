// Import necessary components from React Router
import { Routes, Route, Navigate } from 'react-router-dom';

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
const MillLayout = ({ userData, onBackToHome }) => {
  return (
    // Flex container for sidebar and main content
    <div className="flex">
      {/* Sidebar navigation */}
      <MillSidebar userData={userData} onBackToHome={onBackToHome} />

      {/* Main content area */}
      <main className="flex-grow bg-gray-50 p-6 md:p-8 lg:p-10 overflow-y-auto">
        {/* Define all routes for Mill pages */}
        <Routes>
          <Route index element={<MillHome userData={userData} />} /> {/* Default home page */}
          <Route path="home" element={<MillHome userData={userData} />} /> {/* Home page */}
          <Route path="register" element={<MillRegistration userData={userData} />} /> {/* Registration page */}
          <Route path="update-stock" element={<MillUpdateStock userData={userData} />} /> {/* Update stock page */}
          <Route path="view-stock" element={<MillViewStock userData={userData} />} /> {/* View stock page */}
          <Route path="paddy-price" element={<MillPaddyPrice userData={userData} />} /> {/* Paddy price page */}
          <Route path="payment" element={<MillPayment userData={userData} />} /> {/* Payment page */}
          <Route path="notifications" element={<MillNotifications userData={userData} />} /> {/* Notifications page */}
          <Route path="profile" element={<MillProfile userData={userData} />} /> {/* Profile page */}
          <Route path="logout" element={<MillLogout onBackToHome={onBackToHome} />} /> {/* Logout page */}
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default MillLayout;