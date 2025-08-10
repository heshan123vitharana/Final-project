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
import { getHeaderHeight, scrollIntoViewWithOffset, smoothScrollTo } from './utils/scroll'

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
      setTimeout(() => setIsNavigating(false), 800)
    }

    // If not on home flow, switch to home first, then scroll on next tick
    if (userFlowState !== 'home') {
      setUserFlowState('home')
      // wait a tick for sections to mount, then scroll
      setTimeout(doScroll, 100)
    } else {
      doScroll()
    }
  }

  const scrollToTop = () => {
    smoothScrollTo(0)
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
  const sections = ['home', 'about', 'features', 'collection-centers', 'live-paddy-prices', 'contact']
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
    
    // Restore last visited section on reload (if present)
  const lastSection = sessionStorage.getItem('lastVisitedSection')
    if (lastSection) {
      // Delay slightly to ensure sections are mounted
      setTimeout(() => handleNavigation(lastSection), 50)
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('openAdminLogin', handleOpenAdminLogin)
      window.removeEventListener('openMillRegistration', handleOpenMillRegistration)
      // Clean up global function
      delete window.openMillRegistration
      sectionObserver.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist last visited section as it changes
  useEffect(() => {
    try { sessionStorage.setItem('lastVisitedSection', currentPage) } catch { /* ignore */ }
  }, [currentPage])

  // (removed) scroll speed preference control

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
        
  {/* About Section with slide-in effect (id is inside component to avoid duplicate IDs) */}
  <section className="relative overflow-hidden">
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
        
        {/* Collection Centers Section */}
        <SectionTransition trigger={sectionsVisible['collection-centers']} direction="up" delay={300}>
          <section id="collection-centers" className="relative">
            <CollectionCenters />
          </section>
        </SectionTransition>

        {/* Live Paddy Prices Section */}
        <SectionTransition trigger={sectionsVisible['live-paddy-prices']} direction="up" delay={300}>
          <section id="live-paddy-prices" className="relative">
            <LivePaddyPrices />
          </section>
        </SectionTransition>
        
        {/* Contact Section with slide-in effect */}
        <section id="contact" className="py-16 relative overflow-hidden">
          <SectionTransition trigger={sectionsVisible.contact} direction="left" delay={250}>
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
          className="group w-14 h-14 rounded-full flex items-center justify-center bg-emerald-600 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

        <button
          onClick={() => handleNavigation('contact')}
          className="group w-14 h-14 rounded-full flex items-center justify-center bg-amber-500 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-amber-600 hover:shadow-xl hover:-translate-y-0.5"
          aria-label="Contact us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>

        <a
          href="tel:+94112345678"
          className="group w-14 h-14 rounded-full flex items-center justify-center bg-red-600 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5"
          aria-label="Emergency contact"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>

  {/* removed scroll speed preference control */}

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
