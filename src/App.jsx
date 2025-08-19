import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Home from './Pages/Home';
import MillRegistration from './Pages/MillRegistration';
import UpdateStock from './Pages/UpdateStock';
import ViewStock from './Pages/ViewStock';
import PaddyPrice from './Pages/PaddyPrice';
import Payment from './Pages/Payment';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        {/* Main content area */}
        <main className="flex-grow bg-gray-50 p-6 md:p-8 lg:p-10 overflow-y-auto">
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