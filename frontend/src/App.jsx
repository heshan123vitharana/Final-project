import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import { SectionTransition } from './components/PageTransition'
import { getHeaderHeight, scrollIntoViewWithOffset, smoothScrollTo } from './utils/scroll'
import MillLayout from './MillComponents/MillLayout'
// Import ToastProvider
import ToastProvider from './components/ToastProvider'
// Import logout toast handler
import { handleLogoutSuccess } from './utils/validation'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [UNUSED_isNavigating, setIsNavigating] = useState(false)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const [adminData, setAdminData] = useState(null)
  
  // Admin section navigation state

  
  // User authentication and flow state
  const [userFlowState, setUserFlowState] = useState('home') // 'home', 'auth', 'pmb_registration'
  const [userData, setUserData] = useState(null)
  
  // Set page title based on user flow state
  useEffect(() => {
    if (userFlowState === 'home') {
      document.title = 'Paddy Marketing Board In Sri Lanka';
    } else if (userFlowState === 'auth') {
      document.title = 'Sign In | Paddy Marketing Board Sri Lanka';
    }
    // Mill dashboard and admin dashboard pages handle their own titles via individual components
  }, [userFlowState]);
  
  const [sectionsVisible] = useState({
    home: true,
    about: true,
    features: true,
    'collection-centers': true,
    'live-paddy-prices': true,
    contact: true
  })

  // Load user data from session storage on initial load
  useEffect(() => {
    const savedUserData = sessionStorage.getItem('millOwnerData')
    const savedAdminData = sessionStorage.getItem('adminData')

    if (savedUserData) {
      try {
        const user = JSON.parse(savedUserData)
        setUserData(user)
      } catch (error) {
        console.error('❌ Error parsing mill user data from session:', error)
        sessionStorage.removeItem('millOwnerData')
      }
    }

    if (savedAdminData) {
      try {
        const admin = JSON.parse(savedAdminData)
        setAdminData(admin)
      } catch (error) {
        console.error('❌ Error parsing admin data from session:', error)
        sessionStorage.removeItem('adminData')
      }
    }
  }, [])

  // Handle mill owner registration button click
  const handleMillRegistrationClick = () => {
    window.location.href = '/auth'
  }

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    setUserData(user)
    // Store user data in sessionStorage for session persistence
    sessionStorage.setItem('millOwnerData', JSON.stringify(user))

    // Check if it's a first-time login and show appropriate message
    if (user.isFirstLogin) {
      // Import toast manually since it might not be available in App.jsx context
      import('react-hot-toast').then(({ default: toast }) => {
        toast('Welcome! Please complete your profile to access all features.');
      });
    }

    // Navigate to mill dashboard
    window.location.href = '/mill/home'
  }

  // Handle admin logout
  const handleAdminLogout = () => {
    sessionStorage.removeItem('adminData');
    setAdminData(null);
    handleLogoutSuccess('Admin');
    window.location.href = '/';
  }

  // Handle mill owner logout
  const handleMillLogout = () => {
    sessionStorage.removeItem('millOwnerData');
    setUserData(null);
    handleLogoutSuccess('Mill Owner');
    window.location.href = '/';
  }

  // Handle updating user data after registration completion
  const handleUserDataUpdate = (updatedUserData) => {
    sessionStorage.setItem('millOwnerData', JSON.stringify(updatedUserData))
    setUserData(updatedUserData)
  }

  // Handle back to dashboard from PMB registration
  const handleBackToDashboard = () => {
    window.location.href = '/mill/home'
  }

  const handleNavigation = (page) => {
    const doScroll = () => {
      setIsNavigating(true)
      setCurrentPage(page)
      // Compute dynamic header height (top banner + header)
      const headerHeight = getHeaderHeight(80)

      if (page === 'home') {
        smoothScrollTo(0)
      } else {
        const element = document.getElementById(page)
        if (element) {
          scrollIntoViewWithOffset(element, headerHeight)
        }
      }

      setTimeout(() => {
        setIsNavigating(false)
      }, 300)
    }

    doScroll()
  }

  return (
    <Router>
      <ToastProvider>
        <div className="App">
          <Routes>
            {/* Main Landing Page Route */}
            <Route path="/" element={
              <>
                <Header
                  currentPage={currentPage}
                  onNavigate={handleNavigation}
                  onAdminClick={() => setIsAdminLoginOpen(true)}
                  onMillRegistrationClick={handleMillRegistrationClick}
                />

                <main className="relative">
                  <SectionTransition id="home" isVisible={sectionsVisible.home}>
                    <HeroSection onAdminLogin={() => setIsAdminLoginOpen(true)} />
                  </SectionTransition>

                  <SectionTransition id="about" isVisible={sectionsVisible.about}>
                    <About />
                  </SectionTransition>

                  <SectionTransition id="features" isVisible={sectionsVisible.features}>
                    <Features />
                  </SectionTransition>

                  <SectionTransition id="collection-centers" isVisible={sectionsVisible['collection-centers']}>
                    <CollectionCenters />
                  </SectionTransition>

                  <SectionTransition id="live-paddy-prices" isVisible={sectionsVisible['live-paddy-prices']}>
                    <LivePaddyPrices />
                  </SectionTransition>

                  <SectionTransition id="contact" isVisible={sectionsVisible.contact}>
                    <Contact />
                  </SectionTransition>
                </main>

                <Footer />

                {/* Admin Login Modal */}
                {isAdminLoginOpen && (
                  <AdminLogin
                    onBackToHome={() => setIsAdminLoginOpen(false)}
                    onLogin={(admin) => {
                      setAdminData(admin)
                      setIsAdminLoginOpen(false)
                      window.location.href = '/admin'
                    }}
                  />
                )}
              </>
            } />

            {/* Authentication Route */}
            <Route path="/auth" element={
              <AuthPage
                onBackToHome={() => window.location.href = '/'}
                onExit={() => window.location.href = '/'}
                onAuthSuccess={handleAuthSuccess}
                onGoToRegistration={() => setUserFlowState('pmb_registration')}
              />
            } />

            {/* PMB Registration Route */}
            <Route path="/pmb-registration" element={
              <MillOwnerRegistration
                userData={userData}
                onRegistrationComplete={handleUserDataUpdate}
                onBackToDashboard={handleBackToDashboard}
              />
            } />

            {/* Reset Password Route */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Mill Dashboard Routes */}
            <Route path="/mill/*" element={
              userData ? (
                <MillLayout userData={userData} onBackToHome={handleMillLogout} />
              ) : (
                <div style={{ 
                  padding: '24px', 
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    color: '#856404',
                    padding: '24px',
                    borderRadius: '8px',
                    maxWidth: '400px'
                  }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                      Authentication Required
                    </h2>
                    <p style={{ marginBottom: '16px' }}>
                      Please log in to access the mill dashboard.
                    </p>
                    <a 
                      href="/auth" 
                      style={{ 
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      Go to Login
                    </a>
                  </div>
                </div>
              )
            } />

            {/* Admin Dashboard Route */}
            <Route path="/admin/*" element={
              adminData ? (
                <AdminDashboard adminData={adminData} onLogout={handleAdminLogout} />
              ) : (
                <div style={{ 
                  padding: '24px', 
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    color: '#856404',
                    padding: '24px',
                    borderRadius: '8px',
                    maxWidth: '400px'
                  }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                      Admin Authentication Required
                    </h2>
                    <p style={{ marginBottom: '16px' }}>
                      Please log in as an administrator to access the admin dashboard.
                    </p>
                    <a 
                      href="/" 
                      style={{ 
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      Go to Home
                    </a>
                  </div>
                </div>
              )
            } />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={
              <div style={{ 
                padding: '24px', 
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div>
                  <h1>Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/">Go to Home</a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  )
}

export default App