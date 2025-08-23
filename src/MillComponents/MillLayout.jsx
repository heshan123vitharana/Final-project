import { Routes, Route } from 'react-router-dom';
import MillSidebar from './MillSidebar.jsx';  // <- corrected import with .jsx

import MillHome from '../MillPages/MillHome.jsx';
import MillRegistration from '../MillPages/MillRegistration.jsx';
import MillUpdateStock from '../MillPages/MillUpdateStock.jsx';
import MillViewStock from '../MillPages/MillViewStock.jsx';
import MillPaddyPrice from '../MillPages/MillPaddyPrice.jsx';
import MillPayment from '../MillPages/MillPayment.jsx';
import MillProfile from '../MillPages/MillProfile.jsx';
import MillNotifications from '../MillPages/MillNotifications.jsx';
import MillLogout from '../MillPages/MillLogout.jsx';

const MillLayout = () => {
  return (
    <div className="flex">
      <MillSidebar />
      <main className="flex-grow bg-gray-50 p-6 md:p-8 lg:p-10 overflow-y-auto">
        <Routes>
          <Route path="/" element={<MillHome />} />
          <Route path="/register" element={<MillRegistration />} />
          <Route path="/update-stock" element={<MillUpdateStock />} />
          <Route path="/view-stock" element={<MillViewStock />} />
          <Route path="/paddy-price" element={<MillPaddyPrice />} />
          <Route path="/payment" element={<MillPayment />} />
          <Route path="/profile" element={<MillProfile />} />
          <Route path="/notifications" element={<MillNotifications />} />
          <Route path="/logout" element={<MillLogout />} />
        </Routes>
      </main>
    </div>
  );
};

export default MillLayout;
