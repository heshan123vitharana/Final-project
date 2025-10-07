import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import About from './components/About-New';
import Features from './components/Features';
import CollectionCenters from './components/CollectionCenters';
import LivePaddyPrices from './components/LivePaddyPrices';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ResetPassword from './components/ResetPassword';
import MillLayout from './MillComponents/MillLayout';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPageWrapper />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/mill/*" element={<MillPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </ToastProvider>
    </Router>
  );
}

const HomePage = () => (
  <div className="min-h-screen bg-white">
    <Header 
      onAdminClick={() => window.location.href = '/admin'}
      onMillRegistrationClick={() => window.location.href = '/auth'}
    />
    <HeroSection />
    <About />
    <Features />
    <CollectionCenters />
    <LivePaddyPrices />
    <Contact />
    <Footer />
  </div>
);

const AuthPageWrapper = () => {
  const [isMillAuthenticated, setIsMillAuthenticated] = useState(!!localStorage.getItem('millData'));

  const handleMillAuthSuccess = (millData) => {
    localStorage.setItem('millData', JSON.stringify(millData));
    setIsMillAuthenticated(true);
  };

  const handleExitAuth = () => {
    window.location.href = '/';
  };

  if (isMillAuthenticated) {
    return <Navigate to="/mill/home" />;
  }

  return <AuthPage onAuthSuccess={handleMillAuthSuccess} onExit={handleExitAuth} />;
};

const AdminPage = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!sessionStorage.getItem('adminData'));
  const [userData, setUserData] = useState(() => {
    const savedData = sessionStorage.getItem('adminData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const handleAdminLoginSuccess = (adminData) => {
    sessionStorage.setItem('adminData', JSON.stringify(adminData));
    setIsAdminAuthenticated(true);
    setUserData(adminData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminData');
    setIsAdminAuthenticated(false);
    setUserData(null);
    window.location.href = '/';
  };

  if (!isAdminAuthenticated) {
    return <AdminLogin onLogin={handleAdminLoginSuccess} onBackToHome={() => window.location.href = '/'} />;
  }

  return <AdminDashboard onLogout={handleLogout} userData={userData} />;
};

const MillPage = () => {
  const [isMillAuthenticated, setIsMillAuthenticated] = useState(!!localStorage.getItem('millData'));
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('millData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('millData');
    setIsMillAuthenticated(false);
    setUserData(null);
    window.location.href = '/';
  };

  if (!isMillAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <MillLayout onLogout={handleLogout} userData={userData} />;
};

export default App;