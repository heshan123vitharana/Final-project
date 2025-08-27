import { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import logoP from '../assets/logo-p.png';

const Header = ({ onNavigate = () => {}, currentPage = 'home', onMillRegistrationClick = () => {}, onAdminClick = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { name: 'HOME', id: 'home', icon: '🏠' },
    { name: 'ABOUT', id: 'platform-features-section', icon: 'ℹ️' },
    { name: 'COLLECTION CENTERS', id: 'collection-centers', icon: '🏢' },
    { name: 'LIVE PRICES', id: 'live-paddy-prices', icon: '💰' },
    { name: 'CONTACT', id: 'contact', icon: '📞' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    console.log('Navigation clicked:', sectionId);
    
    // Close mobile menu immediately
    setIsMenuOpen(false);
    
    // Add smooth transition effect
    document.body.style.pointerEvents = 'none';
    
    // Create subtle ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'fixed inset-0 bg-emerald-500/3 z-40 pointer-events-none transition-opacity duration-300';
    document.body.appendChild(ripple);
    
    // Navigate with proper offset calculation
    setTimeout(() => {
      const headerHeight = isScrolled ? 120 : 140; // Account for banner + header
      
      if (sectionId === 'home') {
        // Scroll to top for home
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('Scrolled to top');
      } else {
        // Try to find the target section
        let targetElement = document.getElementById(sectionId);
        
        // Fallback mappings for different section IDs
        const sectionMappings = {
          'platform-features-section': ['platform-features-section', 'about'],
          'collection-centers': ['collection-centers'],
          'live-paddy-prices': ['live-paddy-prices'],
          'contact': ['contact']
        };
        
        // Try alternative IDs if primary not found
        if (!targetElement && sectionMappings[sectionId]) {
          for (const altId of sectionMappings[sectionId]) {
            targetElement = document.getElementById(altId);
            if (targetElement) {
              console.log(`Found section with alternative ID: ${altId}`);
              break;
            }
          }
        }
        
        if (targetElement) {
          const elementTop = targetElement.offsetTop - headerHeight;
          window.scrollTo({ top: Math.max(0, elementTop), behavior: 'smooth' });
          console.log(`Successfully scrolled to: ${sectionId}`);
        } else {
          console.error(`Section not found: ${sectionId}`);
          console.log('Available sections:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
          // Use the original navigation function as fallback
          onNavigate(sectionId);
        }
      }
      
      // Clean up ripple effect
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        if (document.body.contains(ripple)) {
          document.body.removeChild(ripple);
        }
      }, 300);
    }, 100);
  };

  // Removed handleAdminClick and onAdminClick as Admin button is no longer used

  return (
    <header className={`fixed w-full z-40 top-0 transition-all duration-300 border-b ${
      isScrolled ? 'bg-white/85 backdrop-blur-xl border-emerald-100 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.15)]' : 'bg-white/95 backdrop-blur-md border-transparent'
    }`}>
      {/* Enhanced Colorful Top Banner - Reduced Height */}
  <div className={`bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white text-center relative overflow-hidden ${isScrolled ? 'py-1' : 'py-1.5'}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <p className="text-[11px] font-medium relative z-10">
          <span className="inline-block text-sm">🌾</span> 
          <span className="mx-2">Serving Farmers Island-wide with Fair Paddy Procurement</span>
          <span className="mx-4">|</span>
          <span className="font-semibold">
            <span className="inline-block text-sm">📞</span> 
            <span className="ml-2">Hotline: +94 11 234 5678</span>
          </span>
          {/* Smallest lock icon for admin login */}
          <button
            title="Admin Login"
            onClick={onAdminClick}
            style={{ background: 'transparent', border: 'none', padding: 0, marginLeft: 8, cursor: 'pointer', verticalAlign: 'middle' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M17 8V7a5 5 0 0 0-10 0v1a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-8-1a3 3 0 0 1 6 0v1h-6zm9 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-6-3a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1z"/></svg>
          </button>
        </p>
      </div>

    {/* Enhanced Main Header - dynamic padding for shrink */}
  <div className={`container mx-auto px-4 ${isScrolled ? 'py-1.5' : 'py-2.5'}`}>
        <div className="flex items-center justify-between">
          {/* Logo Section - larger PNG with glow highlight; brand on two lines */}
          <div className="flex items-center space-x-2">
      <div className={`relative rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 ring-1 ring-emerald-300/40 shadow-md flex items-center justify-center overflow-hidden ${isScrolled ? 'w-10 h-10 md:w-11 md:h-11' : 'w-11 h-11 md:w-12 md:h-12'}`}>
              <img 
                src={logoP} 
                alt="PMB Logo" 
                className="w-9 h-9 md:w-10 md:h-10 object-contain"
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm md:text-base font-bold text-gradient-primary leading-[1.05]">
                <span className="block">Paddy Marketing</span>
                <span className="block">Board</span>
              </h1>
              <p className="text-[10px] md:text-[11px] text-gray-600 leading-none mt-0.5">Ministry of Agriculture - Sri Lanka</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <nav className="flex space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2.5 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-1.5 nav-btn-${item.id} ${
                    currentPage === item.id ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full origin-left transition-transform duration-300 ease-out ${
                      currentPage === item.id ? 'bg-emerald-600 scale-x-100' : 'bg-transparent scale-x-0'
                    }`}
                  />
                </button>
              ))}
            </nav>
            
            {/* Language Selector */}
            <LanguageSelector />

            {/* Sign In Button - previously Register */}
            <button
              onClick={() => {
                console.log('Header Sign In button clicked - using prop function');
                onMillRegistrationClick();
              }}
              className="px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-base">🏭</span>
              <span className="text-[11px]">Sign In</span>
            </button>
            
            {/* Admin Login Button removed as requested */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mobile-menu-icon"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-emerald-100 space-y-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors flex items-center gap-3 nav-btn-${item.id} ${
                    currentPage === item.id ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* Mobile Language Selector */}
            <div className="px-4">
              <LanguageSelector />
            </div>
            
            {/* Mobile Admin Button removed as requested */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;