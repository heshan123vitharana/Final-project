import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'  
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import About from './components/About-New'
import Features from './components/Features'
import CollectionCenters from './components/CollectionCenters'
import LivePaddyPrices from './components/LivePaddyPrices'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import MillOwnerRegistration from './components/MillOwnerRegistration'     
import AuthPage from './components/AuthPage'
import AdminDashboard from './components/admin/AdminDashboard'
import ResetPassword from './components/ResetPassword'
import MillLayout from './MillComponents/MillLayout'
import ToastProvider from './components/ToastProvider'

function App() {
  const [userFlowState, setUserFlowState] = useState('home')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isMillAuthenticated, setIsMillAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (userFlowState === 'home') {
      document.title = 'Paddy Marketing Board In Sri Lanka';
    } else if (userFlowState === 'auth') {
      document.title = 'Sign In | Paddy Marketing Board Sri Lanka';        
    } else if (userFlowState === 'admin') {
      document.title = 'Admin Dashboard | PMB Sri Lanka';
    }
  }, [userFlowState]);

  const handleAdminClick = () => {
    setUserFlowState('admin')
    setIsAdminAuthenticated(false) // Reset admin auth state
  }

  const handleMillRegistrationClick = () => {
    setUserFlowState('auth')
  }

  const handleAdminLoginSuccess = (adminData) => {
    console.log('Admin login success:', adminData)
    setIsAdminAuthenticated(true)
    setUserData(adminData)
    // Stay in admin state but now show dashboard
  }

  const handleMillAuthSuccess = (millData) => {
    console.log('Mill owner auth success:', millData)
    setIsMillAuthenticated(true)
    setUserData(millData)
    setUserFlowState('mill-dashboard') // Navigate to mill dashboard
  }

  const handleExitAuth = () => {
    setUserFlowState('home')
    setIsAdminAuthenticated(false)
    setIsMillAuthenticated(false)
    setUserData(null)
  }

  const handleLogout = () => {
    setUserFlowState('home')
    setIsAdminAuthenticated(false)
    setIsMillAuthenticated(false)
    setUserData(null)
  }

  return (
    <Router>
      <ToastProvider>
        {userFlowState === 'home' && (
          <div className="min-h-screen bg-white">
            <Header 
              onAdminClick={handleAdminClick}
              onMillRegistrationClick={handleMillRegistrationClick}
            />
            <HeroSection />
            <About />
            <Features />
            <CollectionCenters />
            <LivePaddyPrices />
            <Contact />
            <Footer />
          </div>
        )}
        {userFlowState === 'auth' && (
          <AuthPage 
            onAuthSuccess={handleMillAuthSuccess}
            onExit={handleExitAuth}
          />
        )}
        {userFlowState === 'admin' && !isAdminAuthenticated && (
          <AdminLogin 
            onLogin={handleAdminLoginSuccess}
            onBackToHome={handleExitAuth}
          />
        )}
        {userFlowState === 'admin' && isAdminAuthenticated && (
          <AdminDashboard 
            onLogout={handleLogout}
            userData={userData}
          />
        )}
        {userFlowState === 'mill-dashboard' && isMillAuthenticated && (
          <MillLayout 
            onLogout={handleLogout}
            userData={userData}
          />
        )}
      </ToastProvider>
    </Router>
  )
}

export default App