import { useState, useEffect } from 'react'
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
import MillDashboard from './components/MillDashboard'
import { SectionTransition } from './components/PageTransition'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isNavigating, setIsNavigating] = useState(false)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  
  // User authentication and flow state
  const [userFlowState, setUserFlowState] = useState('home') // 'home', 'auth', 'dashboard', 'pmb_registration'
  const [userData, setUserData] = useState(null)
  
  const [sectionsVisible, setSectionsVisible] = useState({
    home: true,
    about: false,
    features: false,
    'collection-centers': false,
    'live-paddy-prices': false,
    contact: false
  })

  // Check for existing user session on app load
  useEffect(() => {
    const savedUserData = sessionStorage.getItem('millOwnerData')
    if (savedUserData) {
      const user = JSON.parse(savedUserData)
      setUserData(user)
      setUserFlowState('dashboard')
    }
  }, [])

  // Handle mill owner registration button click
  const handleMillRegistrationClick = () => {
    setUserFlowState('auth')
  }

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    setUserData(user)
    setUserFlowState('dashboard')
  }

  // Handle user logout
  const handleLogout = () => {
    sessionStorage.removeItem('millOwnerData')
    setUserData(null)
    setUserFlowState('home')
  }

  // Handle start PMB registration
  const handleStartPMBRegistration = () => {
    setUserFlowState('pmb_registration')
  }

  // Handle PMB registration completion
  const handlePMBRegistrationComplete = (registrationData) => {
    // Update user data with registration info
    const updatedUserData = {
      ...userData,
      pmbRegistration: registrationData
    }
    setUserData(updatedUserData)
    sessionStorage.setItem('millOwnerData', JSON.stringify(updatedUserData))
    setUserFlowState('dashboard')
  }

  // Handle back to dashboard from PMB registration
  const handleBackToDashboard = () => {
    setUserFlowState('dashboard')
  }

  const handleNavigation = (page) => {
    if (userFlowState !== 'home') return // Prevent navigation when in user flow
    
    setIsNavigating(true)
    setCurrentPage(page)
    
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(page)
      if (element) {
        const headerHeight = 60
        const elementPosition = element.offsetTop - headerHeight
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    }
    
    // Reset navigation state after transition
    setTimeout(() => setIsNavigating(false), 800)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    // Make mill registration function available globally for HeroSection
    window.openMillRegistration = () => {
      console.log('Global mill registration function called');
      handleMillRegistrationClick();
    };

    // Handle custom events for modal opening
    const handleOpenAdminLogin = () => {
      console.log('handleOpenAdminLogin triggered');
      setIsAdminLoginOpen(true);
    }
    const handleOpenMillRegistration = () => {
      console.log('handleOpenMillRegistration triggered');
      handleMillRegistrationClick();
    }

    // Add event listeners
    console.log('Adding event listeners for modals');
    window.addEventListener('openAdminLogin', handleOpenAdminLogin)
    window.addEventListener('openMillRegistration', handleOpenMillRegistration)

    const handleScroll = () => {
      const sections = ['home', 'about', 'collection-centers', 'live-paddy-prices', 'contact']
      const headerHeight = 60
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= headerHeight && rect.bottom > headerHeight) {
            setCurrentPage(sections[i])
            break
          }
        }
      }
    }

    // Create intersection observer for section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-20% 0px -20% 0px'
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          setSectionsVisible(prev => ({
            ...prev,
            [sectionId]: true
          }))
        }
      })
    }, observerOptions)

    // Observe all sections
    const sectionElements = document.querySelectorAll('section[id]')
    sectionElements.forEach(section => sectionObserver.observe(section))

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('openAdminLogin', handleOpenAdminLogin)
      window.removeEventListener('openMillRegistration', handleOpenMillRegistration)
      // Clean up global function
      delete window.openMillRegistration
      sectionObserver.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      {/* Render different flows based on user state */}
      {userFlowState === 'auth' && (
        <AuthPage 
          onAuthSuccess={handleAuthSuccess}
          onExit={() => setUserFlowState('home')}
        />
      )}
      
      {userFlowState === 'dashboard' && userData && (
        <MillDashboard 
          userData={userData}
          onStartPMBRegistration={handleStartPMBRegistration}
          onLogout={handleLogout}
        />
      )}
      
      {userFlowState === 'pmb_registration' && userData && (
        <MillOwnerRegistration 
          userData={userData}
          onRegistrationComplete={handlePMBRegistrationComplete}
          onBack={handleBackToDashboard}
        />
      )}
      
      {userFlowState === 'home' && (
        <>
          {/* Navigation progress indicator */}
          {isNavigating && (
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-800 ease-out" 
                   style={{ width: '100%' }}>
              </div>
            </div>
          )}
          
          <Header 
            onNavigate={handleNavigation} 
            currentPage={currentPage}
            isAdminLoggedIn={isAdminLoggedIn}
            onAdminClick={() => setIsAdminLoginOpen(true)}
            onMillRegistrationClick={handleMillRegistrationClick}
          />
          
          <main className="relative">
        {/* Hero Section with enhanced animations */}
        <section id="home" className="relative">
          <SectionTransition trigger={sectionsVisible.home} direction="up">
            <HeroSection />
          </SectionTransition>
        </section>
        
        {/* About Section with slide-in effect */}
        <section id="about" className="py-16 relative overflow-hidden">
          <SectionTransition trigger={sectionsVisible.about} direction="left" delay={200}>
            <div className="relative z-10">
              <About />
            </div>
          </SectionTransition>
          
          {/* Background decoration for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 -z-10"></div>
        </section>
        
        {/* Features Section with scale-in effect */}
        <SectionTransition trigger={sectionsVisible.features} direction="up" delay={300}>
          <section id="features" className="relative">
            <Features />
            
            {/* Transition decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
          </section>
        </SectionTransition>
        
        {/* Collection Centers Section with enhanced animations */}
        <section id="collection-centers" className="py-16 relative">
          <SectionTransition trigger={sectionsVisible['collection-centers']} direction="up" delay={100}>
            <div className="relative z-10">
              <CollectionCenters />
            </div>
          </SectionTransition>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </section>
        
        {/* Live Paddy Prices Section with enhanced animations */}
        <section id="live-paddy-prices" className="py-16 relative">
          <SectionTransition trigger={sectionsVisible['live-paddy-prices']} direction="up" delay={150}>
            <div className="relative z-10">
              <LivePaddyPrices />
            </div>
          </SectionTransition>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-10 w-40 h-40 bg-yellow-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-20 w-28 h-28 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
        </section>
        
        {/* Contact Section with slide-in effect */}
        <section id="contact" className="py-16 relative overflow-hidden">
          <SectionTransition trigger={sectionsVisible.contact} direction="left" delay={250}>
            <div className="relative z-10">
              <Contact />
            </div>
          </SectionTransition>
          
          {/* Contact section background enhancement */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent -z-10"></div>
        </section>
      </main>
      
      {/* Website footer with transition */}
      <SectionTransition trigger={true} direction="up" delay={500}>
        <Footer />
      </SectionTransition>
      
      {/* Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={scrollToTop}
          className="bg-paddy-green text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        
        <button
          onClick={() => handleNavigation('contact')}
          className="bg-rice-gold text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-110"
          aria-label="Contact us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        
        <a
          href="tel:+94112345678"
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110"
          aria-label="Emergency contact"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>

      {/* Modal Components */}
      <AdminLogin 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={setIsAdminLoggedIn}
      />
      </>
      )}
    </div>
  )
}

export default App
