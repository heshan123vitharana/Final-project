import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MillSidebar from './MillSidebar.jsx';
import ErrorBoundary from '../../ui/components/ErrorBoundary.jsx';

// Import all page components for different routes
import MillHome from '../pages/MillHome.jsx';
import MillRegistration from '../pages/MillRegistration.jsx';
import MillUpdateStock from '../pages/MillUpdateStock.jsx';
import MillViewStock from '../pages/MillViewStock.jsx';
import MillPaddyPrice from '../pages/MillPaddyPrice.jsx';
import MillPayment from '../pages/MillPayment.jsx';
import MillProfile from '../pages/MillProfile.jsx';
import MillNotifications from '../pages/MillNotifications.jsx';

// Main layout component for Mill section
const MillLayout = ({ userData, onLogout, onBackToHome }) => {
  const location = useLocation();


  return (
    // Fixed height flex container for sidebar and main content
    <div className="flex h-screen">
      {/* Fixed sidebar navigation */}
      <MillSidebar userData={userData} onBackToHome={onLogout || onBackToHome} />

      {/* Scrollable main content area */}
      <main className="flex-grow bg-gray-50 p-6 md:p-8 lg:p-10 overflow-y-auto h-full">
        <ErrorBoundary>
          <Routes>
            <Route index element={<MillHome userData={userData} />} />
            <Route path="home" element={<MillHome userData={userData} />} />
            <Route path="register" element={<MillRegistration userData={userData} />} />
            <Route path="update-stock" element={<MillUpdateStock userData={userData} />} />
            <Route path="view-stock" element={<MillViewStock userData={userData} />} />
            <Route path="paddy-price" element={<MillPaddyPrice userData={userData} />} />
            <Route path="payment" element={<MillPayment userData={userData} />} />
            <Route path="notifications" element={<MillNotifications userData={userData} />} />
            <Route path="profile" element={<MillProfile userData={userData} />} />
            <Route path="*" element={
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h2 className="text-lg font-bold text-yellow-800 mb-2">Route Not Found</h2>
                <p className="text-yellow-600 mb-4">
                  The path "{location.pathname}" was not found.
                </p>
                <p className="text-sm text-gray-600">Available routes:</p>
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                  <li>/mill/home</li>
                  <li>/mill/register</li>
                  <li>/mill/update-stock</li>
                  <li>/mill/view-stock</li>
                  <li>/mill/paddy-price</li>
                  <li>/mill/payment</li>
                  <li>/mill/notifications</li>
                  <li>/mill/profile</li>
                </ul>
                <button
                  onClick={() => window.location.href = '/mill/home'}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Go to Home
                </button>
              </div>
            } />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default MillLayout;
